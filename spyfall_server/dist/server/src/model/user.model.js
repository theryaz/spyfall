"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const shared_1 = require("../shared");
const constants_1 = require("./constants");
const enums_1 = require("./enums");
class User {
    createJwt(maxAgeOverride) {
        return shared_1.createJwt({
            data: {
                uuid: this.uuid,
                username: this.username,
                email: this.email,
                role: this.role,
                _id: this._id.toHexString(),
            },
            maxAge: maxAgeOverride || constants_1.JWT_EXPIRY_SECONDS,
        });
    }
    checkPassword(password) {
        return this.password === shared_1.sha512(password, this.salt);
    }
    setPassword(password) {
        this.password = shared_1.sha512(password, this.salt);
    }
    static registerUser({ username, email, password, role, avatarUrl, avatarIcon }) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = shared_1.randomString(16);
            const user = yield exports.UserModel.create({ username, email, role, avatarUrl, avatarIcon });
            user.setPassword(password);
            yield user.save();
            return shared_1.createJwt({
                data: {
                    uuid: user.uuid,
                    username,
                    email,
                    role: role,
                    _id: user._id,
                },
                maxAge: constants_1.JWT_EXPIRY_SECONDS
            });
        });
    }
    getPublicFields() {
        return {
            _id: this._id,
            uuid: this.uuid,
            username: this.username,
            email: this.email,
            role: this.role,
            avatarUrl: this.avatarUrl,
            avatarIcon: this.avatarIcon,
            color: this.color,
        };
    }
}
__decorate([
    typegoose_1.prop({ default: v4_1.default }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typegoose_1.prop({ index: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ default: enums_1.Role.User }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typegoose_1.prop({ default: null }),
    __metadata("design:type", Object)
], User.prototype, "avatarUrl", void 0);
__decorate([
    typegoose_1.prop({ default: 'fa-user' }),
    __metadata("design:type", String)
], User.prototype, "avatarIcon", void 0);
__decorate([
    typegoose_1.prop({ default: 'red' }),
    __metadata("design:type", String)
], User.prototype, "color", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typegoose_1.prop({ default: () => shared_1.randomString(16) }),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
exports.User = User;
;
exports.UserModel = typegoose_1.getModelForClass(User); // UserModel is a regular Mongoose Model with correct types
exports.UserModel.on('index', function () {
    shared_1.logger.info("User Indexes Created");
});
