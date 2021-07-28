const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/comments", function (req, res) {
    db.getComments(req.query.imageId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => console.log(err));
});

router.post("/comments", function (req, res) {
    db.sendComment(req.body.user, req.body.comment, req.body.id)
        .then((results) => {
            res.json({
                comment_text: results.rows[0].comment_text,
                username: results.rows[0].username,
                image_id: results.rows[0].image_id,
                created_at: results.rows[0].created_at,
            });
        })
        .catch((err) => console.log(err));
});

module.exports = router;
