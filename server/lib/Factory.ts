import express, { Request, Response, Application } from "express";
import "reflect-metadata";

import { App } from "../app.module";
import { Module } from "./Module";

export class Factory {
    setHandlers(modules: Module[], app: Application): void {
        for(let i = 0; i < modules.length; i++) {
            let moduleController = modules[i]["controller"];
            let metadataKeys = Reflect.getMetadataKeys(moduleController);
            for(let j = 0; j < metadataKeys.length; j++) {
                let key = metadataKeys[j];
                let metadataValue = Reflect.getMetadata(key, moduleController);
                
                let handler = metadataValue[1].bind(moduleController);
                let path = metadataValue[0];
                app.get(path, handler);
            }
        }
    }

    setMiddlewares(app: Application) {
        
    }

    createApp(): Application {
        let startModule = new App();
        let app = express();
        
        this.setHandlers(startModule.modules, app);
        return app;
    }
}

