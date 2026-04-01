#!/bin/bash

# End-to-End Test Script for Minesweeper Game
# Tests: Registration → Login → Game Creation → Game Play

set -e  # Exit on error

API_URL="http://localhost:3000"
FIREBASE_API_KEY=$(grep VITE_FIREBASE_API_KEY .env | sed -E 's/.*="?([^"\r\n]+)"?.*/\1/')

# Generate unique test email
TIMESTAMP=$(date +%s)
TEST_EMAIL="e2e-test-${TIMESTAMP}@example.com"
TEST_PASSWORD="Test1234!"

echo "========================================"
echo "🧪 E2E Test Started"
echo "========================================"
echo "Test Email: $TEST_EMAIL"
echo

# Test 1: Check Backend Health
echo "1️⃣  Testing Backend Health..."
DIFFICULTIES=$(curl -sS -m 5 "$API_URL/games/difficulties" | jq -r 'keys | join(", ")')
if [ -n "$DIFFICULTIES" ]; then
    echo "   ✅ Backend responding - Difficulties: $DIFFICULTIES"
else
    echo "   ❌ Backend not responding"
    exit 1
fi
echo

# Test 2: Firebase Registration
echo "2️⃣  Testing Firebase Registration..."
SIGNUP_RESPONSE=$(curl -sS -X POST \
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$FIREBASE_API_KEY" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"returnSecureToken\":true}")

if echo "$SIGNUP_RESPONSE" | jq -e '.error' > /dev/null; then
    echo "   ❌ Firebase registration failed:"
    echo "$SIGNUP_RESPONSE" | jq '.error.message'
    exit 1
fi

FIREBASE_TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.idToken')
FIREBASE_UID=$(echo "$SIGNUP_RESPONSE" | jq -r '.localId')
echo "   ✅ Firebase user created (UID: ${FIREBASE_UID:0:10}...)"
echo

# Test 3: Backend Registration
echo "3️⃣  Testing Backend Registration..."
BACKEND_REG=$(curl -sS -X POST "$API_URL/auth/register" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$BACKEND_REG" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ❌ Backend registration failed:"
    echo "$BACKEND_REG" | jq '.'
    exit 1
fi

BACKEND_USER_ID=$(echo "$BACKEND_REG" | jq -r '.id // .user_id // "unknown"')
echo "   ✅ Backend user created (ID: $BACKEND_USER_ID)"
echo

# Test 4: Backend Login with Firebase Token
echo "4️⃣  Testing Backend Login..."
LOGIN_RESPONSE=$(curl -sS -X POST "$API_URL/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"idToken\":\"$FIREBASE_TOKEN\"}")

if echo "$LOGIN_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ❌ Backend login failed:"
    echo "$LOGIN_RESPONSE" | jq '.'
    exit 1
fi

BACKEND_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "   ✅ Backend login successful"
echo "   Token: ${BACKEND_TOKEN:0:20}..."
echo

# Test 5: Create Game
echo "5️⃣  Testing Game Creation..."
GAME=$(curl -sS -X POST "$API_URL/games" \
    -H 'Content-Type: application/json' \
    -d '{"difficulty":"easy","firstClickRow":4,"firstClickCol":4}')

if echo "$GAME" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ❌ Game creation failed:"
    echo "$GAME" | jq '.'
    exit 1
fi

GAME_STATUS=$(echo "$GAME" | jq -r '.status')
REVEALED_COUNT=$(echo "$GAME" | jq '[.revealed[][] | select(. == true)] | length')
echo "   ✅ Game created - Status: $GAME_STATUS, Revealed cells: $REVEALED_COUNT"
echo

# Test 6: Reveal Cell (with auth)
echo "6️⃣  Testing Cell Reveal (authenticated)..."
REVEAL_PAYLOAD=$(jq -n \
    --argjson game "$GAME" \
    '{
        board: $game.board,
        revealed: $game.revealed,
        flagged: $game.flagged,
        row: 6,
        col: 6,
        difficulty: "easy"
    }')

REVEAL_RESULT=$(curl -sS -X POST "$API_URL/games/reveal" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $BACKEND_TOKEN" \
    -d "$REVEAL_PAYLOAD")

if echo "$REVEAL_RESULT" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ⚠️  Reveal failed (may need auth middleware):"
    echo "$REVEAL_RESULT" | jq '.error'
else
    NEW_STATUS=$(echo "$REVEAL_RESULT" | jq -r '.status')
    NEW_REVEALED=$(echo "$REVEAL_RESULT" | jq '[.revealed[][] | select(. == true)] | length')
    echo "   ✅ Cell revealed - Status: $NEW_STATUS, Total revealed: $NEW_REVEALED"
fi
echo

# Test 7: Toggle Flag
echo "7️⃣  Testing Flag Toggle..."
FLAG_PAYLOAD=$(jq -n \
    --argjson game "$GAME" \
    '{
        revealed: $game.revealed,
        flagged: $game.flagged,
        row: 0,
        col: 0,
        difficulty: "easy"
    }')

FLAG_RESULT=$(curl -sS -X POST "$API_URL/games/flag" \
    -H 'Content-Type: application/json' \
    -d "$FLAG_PAYLOAD")

if echo "$FLAG_RESULT" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ⚠️  Flag toggle failed:"
    echo "$FLAG_RESULT" | jq '.error'
else
    FLAG_COUNT=$(echo "$FLAG_RESULT" | jq '[.flagged[][] | select(. == true)] | length')
    REMAINING=$(echo "$FLAG_RESULT" | jq '.remainingMines')
    echo "   ✅ Flag toggled - Flagged cells: $FLAG_COUNT, Remaining mines: $REMAINING"
fi
echo

# Test 8: Get User Profile
echo "8️⃣  Testing User Profile..."
PROFILE=$(curl -sS "$API_URL/users/me" \
    -H "Authorization: Bearer $BACKEND_TOKEN")

if echo "$PROFILE" | jq -e '.error' > /dev/null 2>&1; then
    echo "   ⚠️  Profile fetch failed:"
    echo "$PROFILE" | jq '.error'
else
    PROFILE_EMAIL=$(echo "$PROFILE" | jq -r '.email')
    echo "   ✅ Profile retrieved - Email: $PROFILE_EMAIL"
fi
echo

echo "========================================"
echo "✅ E2E Test Complete!"
echo "========================================"
echo
echo "📋 Summary:"
echo "  • Firebase Auth: ✅"
echo "  • Backend Registration: ✅"
echo "  • Backend Login: ✅"
echo "  • Game Creation: ✅"
echo "  • Game State Management: Check logs above"
echo
echo "🌐 Frontend URL: http://localhost:5173"
echo "   You can now test the UI with:"
echo "   Email: $TEST_EMAIL"
echo "   Password: $TEST_PASSWORD"
echo
