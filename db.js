var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images 
                    ORDER BY id DESC
                    LIMIT 3;`);
};

module.exports.insertImages = (title, description, username, filename) => {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1,$2,$3,$4) RETURNING title, description, username, url, id;`,
        [
            title,
            description,
            username,
            "https://s3.amazonaws.com/imageboard-spiced2021/" + filename,
        ]
    );
};

module.exports.getNewSetImg = (lastId) => {
    return db.query(
        `
            SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
            ) AS "lowestId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 3;`,
        [lastId]
    );
};
