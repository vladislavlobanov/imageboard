const express = require("express");
const router = express.Router();
const db = require("../db");

const { s3, uploader } = require("../middleware");

router.get("/images", (req, res) => {
    db.getImages().then((results) => {
        res.json(results.rows);
    });
});

router.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    db.insertImages(
        req.body.title,
        req.body.desc,
        req.body.username,
        req.file.filename
    )
        .then((results) => {
            res.json({
                title: results.rows[0].title,
                description: results.rows[0].description,
                username: results.rows[0].username,
                url: results.rows[0].url,
            });
        })
        .catch((err) => console.log(err));
});

module.exports = router;
