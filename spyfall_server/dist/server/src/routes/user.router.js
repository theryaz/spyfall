"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const middleware_1 = require("../middleware");
const shared_1 = require("../shared");
const async_wrap_1 = require("../shared/async-wrap");
const errors_1 = require("../errors");
const db_1 = require("../model/db");
const enums_1 = require("../model/enums");
class UserRouter {
    constructor() {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    middleware() { }
    routes() {
        this.router.route("/register")
            .post(middleware_1.sanitizeBody, async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, avatarIcon } = req.body;
            shared_1.logger.debug('Registering user', req.body);
            const jwt = yield db_1.User.registerUser({ username, email, password, role: enums_1.Role.User, avatarIcon });
            res.json({
                jwt
            });
        })));
        this.router.route("/login")
            .post(middleware_1.sanitizeBody, async_wrap_1.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield db_1.UserModel.findOne({ email });
            if (user === null || user.checkPassword(password) === false) {
                throw new errors_1.UnauthorizedError();
            }
            const jwt = user.createJwt();
            res.json({
                username: user.username,
                avatarUrl: user.avatarUrl,
                avatarIcon: user.avatarIcon,
                role: user.role,
                color: user.color,
                jwt,
            });
        })));
    }
}
exports.UserRouter = UserRouter;
exports.default = new UserRouter();
