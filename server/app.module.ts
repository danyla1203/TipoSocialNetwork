import { Module } from '@nestjs/common';
import { Articles } from "./articles/articles.module";

@Module({
    imports: [
        Articles
    ],
    
})
export class AppModule {}