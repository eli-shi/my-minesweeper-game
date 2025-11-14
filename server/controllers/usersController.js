export async function getMe(req, res) {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true, user });
}
