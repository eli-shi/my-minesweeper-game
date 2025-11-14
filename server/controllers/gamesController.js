import prisma from '../services/prisma.js';

export async function listGames(req, res) {
    const user = req.user;
    const games = await prisma.games.findMany({ where: { user_id: user.id }, orderBy: { created_at: 'desc' } });
    res.json({ ok: true, games });
}

export async function createGame(req, res) {
    const user = req.user;
    const { status = 'pending', solved_time = null, diffID = '' } = req.body;
    const game = await prisma.games.create({
        data: {
            status,
            solved_time: solved_time ? new Date(solved_time) : null,
            user_id: user.id,
            diffID,
        },
    });
    res.status(201).json({ ok: true, game });
}

export async function getGame(req, res) {
    const user = req.user;
    const id = Number(req.params.id);
    const game = await prisma.games.findUnique({ where: { id } });
    if (!game || game.user_id !== user.id) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, game });
}

export async function updateGame(req, res) {
    const user = req.user;
    const id = Number(req.params.id);
    const allowed = ['status', 'solved_time', 'diffID'];
    const data = req.body || {};
    const updateData = {};
    for (const k of allowed) {
        if (k in data) updateData[k] = k === 'solved_time' ? (data[k] ? new Date(data[k]) : null) : data[k];
    }
    const existing = await prisma.games.findUnique({ where: { id } });
    if (!existing || existing.user_id !== user.id) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.games.update({ where: { id }, data: updateData });
    res.json({ ok: true, game: updated });
}
