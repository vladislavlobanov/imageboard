const express = require("express");
const app = express();

const images = require("./routers/images");
const comments = require("./routers/comments");

app.use(express.static("./public"));
app.use(express.json());

app.use(images);
app.use(comments);

app.listen(8080, () => console.log("IB server is listening..."));
