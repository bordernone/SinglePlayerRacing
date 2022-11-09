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
        .limit(n)
        .exec((err, docs) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(docs);
            }
        });
});

app.post("/api/scores", (req, res) => {
    const { name, score } = req.body;
    db.insert({ name, score }, (err, doc) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(doc);
        }
    });
});

app.use(express.static("public"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
