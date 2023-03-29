require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// function to get the latest images of Curiosity rover from nasa api
app.get("/curiosity", async (req, res) => {
    try {
        const manifest = await (
            await fetch(
                "https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=zaVUmCw1578G1XNtShog6yqkm7fimstavCu1EEbt"
            )
        ).json();

        const latestDay = manifest?.["photo_manifest"]?.["max_date"];

        const images = await (
            await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${latestDay}&api_key=${process.env.API_KEY}`
            )
        ).json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({ images });
    } catch (err) {
        console.log("error:", err);
    }
});

// function to get the latest images of Opportunity rover from nasa api
app.get("/opportunity", async (req, res) => {
    try {
        const manifest = await (
            await fetch(
                "https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=zaVUmCw1578G1XNtShog6yqkm7fimstavCu1EEbt"
            )
        ).json();

        const latestDay = manifest?.["photo_manifest"]?.["max_date"];

        const images = await (
            await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?earth_date=${latestDay}&api_key=${process.env.API_KEY}`
            )
        ).json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({ images });
    } catch (err) {
        console.log("error:", err);
    }
});

// function to get the latest images of Spirit rover from nasa api
app.get("/spirit", async (req, res) => {
    try {
        const manifest = await (
            await fetch(
                "https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=zaVUmCw1578G1XNtShog6yqkm7fimstavCu1EEbt"
            )
        ).json();

        const latestDay = manifest?.["photo_manifest"]?.["max_date"];

        const images = await (
            await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?earth_date=${latestDay}&api_key=${process.env.API_KEY}`
            )
        ).json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({ images });
    } catch (err) {
        console.log("error:", err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
