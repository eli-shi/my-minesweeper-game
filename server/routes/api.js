import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import * as usersController from '../controllers/usersController.js';
import * as gamesController from '../controllers/gamesController.js';

const router = express.Router();

// health
router.get('/ping', (_, res) => res.json({ ok: true }));

// protected routes (verify token for all following)
router.use(verifyFirebaseToken);

router.get('/me', usersController.getMe);

router.get('/games', gamesController.listGames);
router.post('/games', gamesController.createGame);
router.get('/games/:id', gamesController.getGame);
router.put('/games/:id', gamesController.updateGame);

export default router;
