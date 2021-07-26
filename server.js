const express = require("express");
const app = express();

const images = require("./routers/images");

app.use(express.static("./public"));

app.use(images);

app.listen(8080, () => console.log("IB server is listening..."));
