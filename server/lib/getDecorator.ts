import "reflect-metadata";
import { Request, Response } from "express";

export function get<T>(path: string) {
    return (
        target: any,
        key: any,
        descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>
    ) => {
        Reflect.defineMetadata(key, [path, descriptor.value], target);
    }
}