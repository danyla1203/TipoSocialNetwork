const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

export class Avatar {
    deleteOldAvatars(id: number) {
        let path = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${id}`;
        fs.unlink(`${path}_icon.webp`, (err: Error) => {
            if (err) { console.log("user have a default icon"); }
        });
        fs.unlink(`${path}_full.webp`, (err: Error) => {
            if (err) { console.log("user have a default icon"); }
        });
    }

    makeAvatar(filePath: string, id: number) {
        let targetPath_icon = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + id + "_icon" + ".webp");
        let targetPath_full = path.join("/home/daniil/Desktop/NodeProjects/AuthTest", "/public/img/" + id + "_full" + ".webp");
        sharp(filePath).resize(70, 80).toFile(targetPath_icon);
        sharp(filePath).resize(300, 300).toFile(targetPath_full);
    }
}