var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images;`);
};
