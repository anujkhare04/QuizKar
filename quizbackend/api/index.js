const app = require("../app");
const connectDb = require("../src/db/db.js");

let isConnected = false;

module.exports = async (req, res) => {
    if (!isConnected) {
        try {
            await connectDb();
            isConnected = true;
        } catch (err) {
            console.error("DB connection error in Vercel function:", err);
        }
    }
    return app(req, res);
};
