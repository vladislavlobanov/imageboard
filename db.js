var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images;`);
};

module.exports.insertImages = (title, description, username, filename) => {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1,$2,$3,$4) RETURNING url;`,
        [
            title,
            description,
            username,
            "https://s3.amazonaws.com/imageboard-spiced2021/" + filename,
        ]
    );
};
