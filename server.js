const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const images = require("./routers/images");
const s3 = require("./s3");
const { DataBrew } = require("aws-sdk");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.use(images);

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    console.log(req.body, req.file);
    db.insertImages(
        req.body.title,
        req.body.desc,
        req.body.username,
        req.file.filename
    )
        .then((results) => {
            res.json({
                title: req.body.title,
                description: req.body.desc,
                username: req.body.username,
                url: results.rows[0].url,
            });
        })
        .catch((err) => console.log(err));
});

app.listen(8080, () => console.log("IB server is listening..."));
