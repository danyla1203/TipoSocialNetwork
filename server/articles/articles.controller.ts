import { Controller, Get, Post, Param, Session, Body, Put, Delete, Request } from "@nestjs/common";
import { ArticlesModel } from "./articles.model";
import { Article } from "../types/SqlTypes";
import * as fs from "fs";

@Controller("data")
export class ArticlesController {

    constructor(private model: ArticlesModel) {}

    @Get("articles/:user_id")
    async findMany(
        @Param("user_id") user_id: number
    ): Promise<any> {
        return await this.model.getArticles(user_id);
    }

    @Get("article/:article_id")
    async findOne(
        @Param("article_id") article_id: number,
        @Session() user_id: number
    ) {
        return await this.model.getArticle(article_id, user_id);
    }
    
    @Post("articles/:user_id")
    async createArticle(
        @Body() body: Article,
        @Param("user_id") user_id: number
    ) {
        let photos_list;
        if (body.photos_list) {
            photos_list = body.photos_list.split(",");
        }
        let title = body.title;
        let text = body.text;
        let date = "fuck off";
        this.model.insertArticle(title, text, user_id, photos_list, date);
    }

    @Put("articles/:article_id")
    async updateArticle(
        @Param("article_id") article_id: number,
        @Body() body: Article,
        @Session() user_id: number
    ) {
        let title = body.title;
        let text = body.text;
        let photos_list = body.photos_list;
    
        this.model.updatePhotos(article_id, photos_list);
        this.model.updateArticle(article_id, title, text);

        return "Updated";
    }

    @Delete("articles/:article_id")
    async deleteArticle(
        @Param("article_id") article_id: number
    ): Promise<string> {
        this.model.deleteArticle(article_id);
        return "Deleted";
    }

    @Post("/add-picture")
    async addPicture(@Request() req: Request): Promise<string> {
        let oldPath = `/home/daniil/Desktop/NodeProjects/AuthTest/server/uploads/${req.file.filename}`;
        let newPath = `/home/daniil/Desktop/NodeProjects/AuthTest/public/img/${req.file.filename}_article.webp`;
        fs.rename(oldPath, newPath, (err: Error) => {
            if (err) throw err;
        });
        return `${req.file.filename}_article`;
    }
}