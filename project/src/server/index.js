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

app.get("/:rover", async (req, res) => {
    let { rover } = req.params;

    rover = rover.toLowerCase();

    if (
        !(
            rover === "curiosity" ||
            rover === "opportunity" ||
            rover === "spirit"
        )
    ) {
        console.error(`Client is requesting the wrong rover: ${rover}`);

        res.status(400).send({
            message: `Client is requesting the wrong rover: ${rover}`,
        });
        return;
    }

    try {
        const manifest = await (
            await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`
            )
        ).json();

        const latestDay = manifest?.["photo_manifest"]?.["max_date"];

        const images = await (
            await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${latestDay}&api_key=${process.env.API_KEY}`
            )
        ).json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({ images });
    } catch (err) {
        console.log("error:", err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
