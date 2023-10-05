"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminDto {
    constructor(admin) {
        this.forToken = () => {
            var _a;
            return {
                id: this.id,
                username: this.name,
                email: this.emailAddress,
                createdAt: (_a = this.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            };
        };
        this.toTokens = () => {
            return {
                accessToken: this.accessToken,
            };
        };
        this.id = admin._id;
        this.name = admin.name;
        this.emailAddress = admin.emailAddress;
        this.password = admin.password;
        this.updatedAt = admin.updatedAt;
        this.createdAt = admin.createdAt;
        this.accessToken = admin.accessToken;
        this.isVerified = admin.isVerified;
        this.accessStatus = admin.accessStatus;
    }
    get getModel() {
        return {
            _id: this.id,
            name: this.name,
            emailAddress: this.emailAddress,
            password: this.password,
            accessToken: this.accessToken,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            accessStatus: this.accessStatus
        };
    }
    get getResponse() {
        return {
            id: this.id,
            name: this.name,
            emailAddress: this.emailAddress,
            accessToken: this.accessToken,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            accessStatus: this.accessStatus
        };
    }
}
exports.default = AdminDto;
