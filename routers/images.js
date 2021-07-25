const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/images", (req, res) => {
    db.getImages().then((results) => {
        res.json(results.rows);
    });
});

module.exports = router;
