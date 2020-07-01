import { Response, Request } from "express";
import { Factory } from "./lib/factory";

let factory = new Factory();
let app = factory.createApp();

app.listen(3000);
