import { ModelType } from "../models/Model";

export interface Endpoint {
    run(): void;
    model: ModelType;
}