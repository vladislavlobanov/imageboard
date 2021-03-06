var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = (arg) => {
    if (!arg) {
        return db.query(`SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
            ) AS "lowestId" FROM images 
            ORDER BY id DESC
            LIMIT 6;`);
    } else {
        return db.query(
            `SELECT * FROM images 
            WHERE id = $1;`,
            [arg]
        );
    }
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
            LIMIT 6;`,
        [lastId]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = ($1) ORDER BY id DESC;`,
        [id]
    );
};

module.exports.sendComment = (comment, user, img) => {
    return db.query(
        `INSERT INTO comments (comment_text, username, image_id) VALUES ($1,$2,$3) RETURNING comment_text, username, image_id, created_at;`,
        [comment, user, img]
    );
};
