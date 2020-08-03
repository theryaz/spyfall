"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const errors_1 = require("../errors");
const enums_1 = require("../model/enums");
/**
* Use After authorization middleware. Only allow specified roles through.
* Always allows Admin Role
*/
function authorization(allowedRoles = []) {
    allowedRoles.push(enums_1.Role.Admin); // Always Allow Admins
    return (req, res, next) => {
        const jwt = res.locals.jwtData;
        if (!jwt) {
            throw new errors_1.ForbiddenError("No Token Provided");
        }
        shared_1.logger.silly(`${req.path} allow roles: ${allowedRoles}`, jwt);
        if (allowedRoles.indexOf(jwt.role) === -1) {
            throw new errors_1.ForbiddenError("Not authorized to use this route");
        }
        next();
    };
}
exports.authorization = authorization;
