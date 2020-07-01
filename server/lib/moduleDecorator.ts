export function Module(moduleData: any)  { 
    let controller = moduleData.controller;
    return (constructor: any) => {
        constructor.prototype.controller = new controller();
    }
}
