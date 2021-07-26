const express = require("express");
const app = express();

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

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
const images = require("./routers/images");

app.use(images);

app.post("/upload", uploader.single("file"), function (req, res) {
    if (!req.file) {
        console.log("file is not there!");
        res.sendStatus(500);
    } else {
        console.log(req.file);
        res.json({
            name: req.file.filename,
        });
        console.log("file is there!");
    }
});

app.listen(8080, () => console.log("IB server is listening..."));
