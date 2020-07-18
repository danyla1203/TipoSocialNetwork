import { Controller } from "./Controller";

export function Module(moduleData: any)  {
    let controller = new moduleData.controller();

    return (constructor: any) => {
        return class extends constructor {
            controller: Controller = controller;
        }
    }
}
