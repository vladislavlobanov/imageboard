const express = require("express");
const app = express();

app.use(express.static("./public"));
const images = require("./routers/images");

app.use(images);

app.listen(8080, () => console.log("IB server is listening..."));
