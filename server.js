const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Маршрут для получения актуальной ссылки
app.get('/get-movie-url', async (req, res) => {
    const movieId = req.query.movie; // ID фильма из параметра
    if (!movieId) {
        return res.status(400).json({ error: 'Параметр "movie" обязателен' });
    }

    const moviePageUrl = `https://example.com/movies/${movieId}`; // Замените на реальный URL сайта

    try {
        const response = await axios.get(moviePageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);

        const videoTag = $('source[src*="video-server"]');
        if (!videoTag.length) {
            return res.status(404).json({ error: 'Видео не найдено' });
        }

        const videoUrl = videoTag.attr('src'); // Получаем ссылку с токеном
        res.json({ url: videoUrl }); // Возвращаем ссылку
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
