const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class Avatar {
    deleteOldAvatars(id) {
        let path = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${id}`;
        try {
            fs.unlink(`${path}_icon.webp`, (err) => {
                if (err) throw err;
            });
            fs.unlink(`${path}_full.webp`, (err) => {
                if (err) throw err;
            });
        } catch(err) {
            return;
        }
    }

    makeAvatar(filePath, id) {
        let targetPath_icon = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + id + "_icon" + ".webp");
        let targetPath_full = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + id + "_full" + ".webp");
        sharp(filePath).resize(70, 80).toFile(targetPath_icon);
        sharp(filePath).resize(300, 300).toFile(targetPath_full);
    }
}

module.exports = Avatar;