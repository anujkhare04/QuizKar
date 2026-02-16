const Quiz = require('../model/createquizmodel')

module.exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};






module.exports.random = async (req, res) => {

    try {
        const getquiz = await Quiz.aggregate([{ $sample: { size: 1 } }])
        if (!getquiz) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        res.json(getquiz[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getByCategory = async (req, res) => {
    try {
        const { cat } = req.params;
        const quizzes = await Quiz.find({ category: cat });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.getMixedCategories = async (req, res) => {
    try {

        const categories = await Quiz.distinct("category");

        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }


        const mixedQuizzes = await Promise.all(
            categories.map(async (cat) => {
                const quiz = await Quiz.aggregate([
                    { $match: { category: cat } },
                    { $sample: { size: 1 } }
                ]);
                return quiz[0];
            })
        );

        res.json(mixedQuizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.getcategory = async (req, res) => {
    try {
        // get all distinct categories from quizzes
        const categories = await Quiz.distinct("category");

        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.json(categories); // send array of category names
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: err.message });
    }
};


const { GoogleGenerativeAI } = require("@google/generative-ai");
module.exports.Aiquestions = async (req, res) => {
    try {
        const { topic, noques } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key in .env" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }, { apiVersion: "v1beta" });

        const prompt = `Generate a quiz about "${topic}". 
    Return ONLY a JSON array of "${noques}" objects. Each object must have "question", "options" (array of 4 strings), and "correctAnswer" (index 0-3).`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("Invalid JSON returned by AI");

        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
};


module.exports.generateMockTestTopic = async (req, res) => {
    try {
        const { userTopic } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key in .env" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }, { apiVersion: "v1beta" });

        let prompt;
        if (userTopic) {
            prompt = `Generate a specific, engaging mock test topic based on the keyword/theme: "${userTopic}". 
            Return ONLY a JSON object with:
            {
                "topic": "The generated topic title",
                "description": "A brief prompt or question for the user to answer",
                "tips": ["Tip 1", "Tip 2"]
            }`;
        } else {
            prompt = `Generate a random, interesting mock test topic for an English speaking/writing test.
            Return ONLY a JSON object with:
            {
                "topic": "The generated topic title",
                "description": "A brief prompt or question for the user to answer",
                "tips": ["Tip 1", "Tip 2"]
            }`;
        }

        const result = await model.generateContent(prompt);
        const text = result.response.text(); // it avoid  tracking data (id, timestamps, safety ratings) uneccesaaary to us
         const jsonMatch = text.match(/\{[\s\S]*\}/);  // t effectively cuts away the "Here is your topic..." garbage and leaves you with just { "topic": "Health" }, which is clean, valid code.

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned by AI");
        }

        res.json(JSON.parse(jsonMatch[0]));
         
//          1.jsonMatch[0]

// The .match() function from earlier returns an array (a list) of findings.
// We want the first match it found (which is our specific JSON block {...}).
// Current format: A String that looks like an object: "{ "topic": "Health" }"

// 2. JSON.parse(...)
// "String to Object"

// JavaScript code cannot read properties from a string. It needs a real Object.
// JSON.parse() takes that text string and converts it into a live JavaScript Object.
// Result: Now we have a real object: { topic: "Health" }. We can now do things like obj.topic.

// 3. res.json(...)
// "Send to Frontend"

// res
//  stands for "Response". It is the object express gives us to talk back to the browser.
// .json() is a function that:
// Takes our JavaScript Object.
// Sets the correct HTTP Headers (Content-Type: application/json).
// Sends it over the internet to the Frontend (React).
// Summary: "Take the clean text string match, turn it into a real code object, and ship it back to the 
// MockTest.jsx
//  page."
        


    } catch (error) {
        console.error("AI Topic Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports.evaluateMockTest = async (req, res) => {
    try {
        const { topic, userAnswer } = req.body;

        if (!topic || !userAnswer) {
            return res.status(400).json({ error: "Topic and userAnswer are required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key in .env" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-2.5-flash with JSON enforcement
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }, { apiVersion: "v1beta" });

        const prompt = `You are an English language examiner. Evaluate the following user answer for the topic: "${topic}".
        
        User Answer: "${userAnswer}"

        Score the answer (0-10) on these criteria:
        1. Fluency (Smoothness and flow)
        2. Grammar (Correctness)
        3. English (Vocabulary and usage)
        4. Confidence (Tone certanity - estimate from text)
        5. Content (Relevance and depth)

        Return ONLY a JSON object:
        {
            "scores": {
                "fluency": number,
                "grammar": number,
                "english": number,
                "confidence": number,
                "content": number
            },
            "overallScore": number,
            "feedback": "Constructive feedback string"
        }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned by AI");
        }

        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error("AI Evaluation Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};