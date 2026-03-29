const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const fetchUser = require('../middleware/fetchUser');
const axios = require('axios');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/add', fetchUser, async (req, res) => {
    try {
        const { destination, startDate, endDate } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);
        let totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (totalDays <= 0) totalDays = 1;

        let imageUrl = "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"; 
        
        try {
            const landmarkPrompt = `Identify the single most iconic, visually famous landmark name for ${destination} that makes for a beautiful photograph. Only return the name, no extra text. For example, for 'Paris' return 'Eiffel Tower', for 'Gulbarga' return 'Sharana Basaveshwara Temple'.`;
            const landmarkCompletion = await groq.chat.completions.create({
                messages: [{ role: "user", content: landmarkPrompt }],
                model: "llama-3.1-8b-instant",
                max_tokens: 50
            });
            const landmarkName = landmarkCompletion.choices[0].message.content.trim();

            const pexelsSearchQuery = `${destination} ${landmarkName} landmark beautiful`;
            const pexelsRes = await axios.get(`https://api.pexels.com/v1/search?query=${pexelsSearchQuery}&per_page=1&orientation=landscape`, {
                headers: { Authorization: process.env.PEXELS_API_KEY }
            });

            if (pexelsRes.data.photos.length > 0) {
                imageUrl = pexelsRes.data.photos[0].src.landscape;
            }
        } catch (imgErr) {
            console.error("Image fetch sequence failed:", imgErr.message);
        }

        // 🧠 NAYA STRICT PROMPT: AI ko main jagah daalne ke liye force karna
        const prompt = `Act as an expert local travel planner with deep cultural knowledge. Create a detailed, realistic ${totalDays}-day itinerary for ${destination}. 
        
        CRITICAL INSTRUCTION: You MUST prioritize and include the absolute TOP, most iconic, and historically significant tourist attractions of the destination. Do NOT skip the main landmarks. (e.g., If the destination is Gulbarga/Kalaburagi, you MUST include 'Sharana Basaveshwara Temple', 'Gulbarga Fort', and 'Khwaja Bande Nawaz Dargah'. If Hyderabad, include 'Charminar').
        
        Give ONE specific, accurate estimated price in INR for every item. Provide a detailed, specific, non-generic description in the 'summary' field mentioning concrete local highlights.

        Return STRICTLY in JSON format. Structure exactly like this: 
        { 
          "summary": "A descriptive, detailed 2-sentence intro about this specific trip to ${destination}, mentioning its top main landmarks.",
          "itinerary": [
            {
              "day": 1,
              "title": "Arrival and Iconic Sightseeing",
              "places": [ { "name": "Most Famous Place Name Here", "costINR": 150 } ],
              "food": [ { "name": "Specific local dish at a specific place", "costINR": 250 } ]
            }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const aiData = JSON.parse(chatCompletion.choices[0].message.content);

        const newTrip = new Trip({
            user: req.userId,
            destination,
            startDate,
            endDate,
            imageUrl,
            summary: aiData.summary,
            itinerary: aiData.itinerary,
            totalMaxCost: 0 // Frontend ab khud calculate kar raha hai
        });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);

    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get('/all', fetchUser, async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 }); 
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trips" });
    }
});

router.delete('/:id', fetchUser, async (req, res) => {
    try {
        await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });
        res.status(200).json({ message: "Trip deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete" });
    }
});

module.exports = router;