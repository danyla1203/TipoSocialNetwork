import express, { Request, Response } from "express";
import "reflect-metadata";

import { App } from "../app.module";

export class Factory {
    
    createApp() {
        let startModule = new App();
        let app = express();
        
        for(let i = 0; i < startModule.modules.length; i++) {
            let moduleController = startModule.modules[i]["controller"];
            let metadataKeys = Reflect.getMetadataKeys(moduleController);
            for(let j = 0; j < metadataKeys.length; j++) {
                let key = metadataKeys[j];
                let metadataValue = Reflect.getMetadata(key, moduleController);

                app.get(metadataValue[0], metadataValue[1]);
            }
        }
        return app;
    }
}

