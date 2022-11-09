const express = require("express");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
// import nedb
const Datastore = require("nedb");

// setup nedb
const db = new Datastore({
    filename: "data.db",
    autoload: true,
    timestampData: true,
});

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

morganBody(app);

app.get("/api/get-scores", (req, res) => {
    let n = req.query.n;
    if (n === undefined) {
        n = 10;
    }

    db.find({})
        .sort({ score: -1 })
        .exec((err, docs) => {
            if (err) {
                res.status(500).send(err);
            } else {
                let playerNames = new Set();
                let scores = [];
                for (const doc of docs) {
                    if (!playerNames.has(doc.name)) {
                        playerNames.add(doc.name);
                        scores.push(doc);
                    }

                    if (scores.length >= n) {
                        break;
                    }
                }

                res.send(scores);
            }
        });
});

app.post("/api/scores", (req, res) => {
    const { name, score } = req.body;
    if (name === undefined || score === undefined) {
        res.status(400).send("Invalid request");
    } else {
        let currentHighScore = 0;

        // Get high score
        db.find({})
            .sort({ score: -1 })
            .limit(1)
            .exec((err, docs) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (docs.length > 0) {
                        currentHighScore = docs[0].score;
                    }

                    // Save score and name to db
                    db.insert({ name, score }, (err, newDoc) => {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.send({
                                ...newDoc,
                                highScore: Math.max(currentHighScore, score),
                                highScoreBroken: score > currentHighScore,
                            });
                        }
                    });
                }
            });
    }
});

app.use(express.static("public"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
