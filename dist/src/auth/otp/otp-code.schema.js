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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCodeSchema = exports.OtpCode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let OtpCode = class OtpCode {
    _id;
    email;
    code;
    type;
    expiresAt;
};
exports.OtpCode = OtpCode;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OtpCode.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OtpCode.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OtpCode.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OtpCode.prototype, "expiresAt", void 0);
exports.OtpCode = OtpCode = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OtpCode);
exports.OtpCodeSchema = mongoose_1.SchemaFactory.createForClass(OtpCode);
exports.OtpCodeSchema.index({ email: 1, code: 1, type: 1 });
exports.OtpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=otp-code.schema.js.map