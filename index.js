const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server running");
});

app.get("/data", async (req, res) => {
    try {
        const response = await fetch("https://api.example.com/users");

        const data = await response.json();

        // basic processing
        const result = {
            totalUsers: data.length,
            success: true
        };

        res.json(result);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});