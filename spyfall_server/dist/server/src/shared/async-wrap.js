"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncWrap(routeControllerFn) {
    return (req, res, next) => {
        Promise.resolve(routeControllerFn(req, res, next)).catch(next);
    };
}
exports.asyncWrap = asyncWrap;
;
