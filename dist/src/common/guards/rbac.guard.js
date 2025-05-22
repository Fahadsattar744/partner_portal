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
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_schema_1 = require("../../user/schemas/user.schema");
let RbacGuard = class RbacGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const method = req.method;
        const user = req.user;
        if (!user)
            return true;
        const role = user.role;
        if (!role)
            throw new common_1.ForbiddenException('Missing user role');
        switch (role) {
            case user_schema_1.UserRole.Admin:
                return true;
            case user_schema_1.UserRole.Editor:
                if (['GET', 'PATCH'].includes(method))
                    return true;
                break;
            case user_schema_1.UserRole.Viewer:
                if (method === 'GET')
                    return true;
                break;
        }
        throw new common_1.ForbiddenException(`Access denied for role: ${role}`);
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map