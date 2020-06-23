import { Module } from "@nestjs/common";
import { ArticlesModel } from "./articles.model";
import { ArticlesController } from "./articles.controller";
import { SqlMaker } from "../test_liba";

@Module({
    providers: [
        ArticlesModel,
        SqlMaker
    ],
    controllers: [ ArticlesController ]
})
export class Articles {}