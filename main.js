const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

// Root Route (GET) for checking if the server is running
app.get('/', (req, res) => {
    res.send('Server is running. Use POST /check to test the functionality.');
});

// POST Route for /check to fetch data from the provided URL
app.post('/check', async (req, res) => {
    const { url } = req.body;

    // Validate the URL
    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'Invalid URL' });
    }

    try {
        // Fetch the HTML content from the provided URL
        const response = await axios.get(url);
        const htmlContent = response.data;

        // Load the HTML content into Cheerio
        const $ = cheerio.load(htmlContent);

        // Extract the number of correct answers (rightAns class)
        const correctAnswers = $('.rightAns').length;

        // Extract the number of wrong answers (wrngAns class)
        const wrongAnswers = $('.wrngAns').length;

        // Extract the number of attempted answers (bold class)
        const attemptedAnswers = $('.bold').length;

        // Return the data in JSON format
        res.json({
            success: true,
            message: 'Data fetched successfully',
            data: {
                correctAnswers,
                wrongAnswers,
                attemptedAnswers,
                url
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to process the URL',
            error: error.message
        });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
