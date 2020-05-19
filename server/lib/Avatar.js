const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class Avatar {
    renameAvatars(oldName, newName, filePath) {
        let oldPath = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${oldName}`;
        let newPath = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${newName}`;
        try {
            fs.rename(`${oldPath}_full.webp`, `${newPath}_full.webp`, (err) => {
                if (err) throw err;
            })
            fs.rename(`${oldPath}_icon.webp`, `${newPath}_icon.webp`, (err) => {
                if (err) throw err;
            })
        } catch (err) {
            console.log("\n WAS FUCKING ERROR \n");
            if (!newName) {
                this.makeAvatar(filePath, oldName);
            } else {
                this.makeAvatar(filePath, newName);
            }
        }
       
    }

    deleteOldAvatars(name) {
        let path = `/home/daniil/Desktop/Node projects/AuthTest/public/img/${name}`;
        fs.unlink(`${path}_icon.webp`, (err) => {
            if (err) throw err;
        });
        fs.unlink(`${path}_full.webp`, (err) => {
            if (err) throw err;
        });
    }

    makeAvatar(filePath, newName, oldName) {
        let targetPath_icon = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + (newName || oldName) + "_icon" + ".webp");
        let targetPath_full = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + (newName || oldName) + "_full" + ".webp");
        sharp(filePath).resize(70, 80).toFile(targetPath_icon);
        sharp(filePath).resize(300, 300).toFile(targetPath_full);
    }
}

module.exports = Avatar;