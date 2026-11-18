export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği kabul edilir.' });
    }

    const { paymentId } = req.body || {};
    if (!paymentId || !/^[a-zA-Z0-9_-]+$/.test(paymentId)) {
        return res.status(400).json({ error: 'Geçersiz paymentId.' });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Sunucuda PI_API_KEY tanımlı değil.' });
    }

    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || 'Pi onay hatası', detail: data });
        }

        return res.status(200).json({ ok: true, payment: data });
    } catch (err) {
        return res.status(500).json({ error: 'Pi sunucusuna ulaşılamadı.' });
    }
}