import { Factory } from "./lib/Factory";

let factory = new Factory();
let app = factory.createApp();

app.listen(3000);
