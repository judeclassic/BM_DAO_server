"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleUserServiceDto = void 0;
class RaiderUserServiceDto {
    constructor(subUser) {
        this._id = subUser._id;
        this.accountType = subUser.accountType;
        this.userId = subUser.userId;
        this.updatedAt = subUser.updatedAt;
        this.createdAt = subUser.createdAt;
        this.subscriptionDate = subUser.subscriptionDate;
        this.isVerified = subUser.isVerified;
        this.work_timeout = subUser.work_timeout;
        this.analytics = subUser.analytics;
    }
    get getDBModel() {
        return {
            accountType: this.accountType,
            userId: this.userId,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
            subscriptionDate: this.subscriptionDate,
            work_timeout: this.work_timeout,
            analytics: this.analytics
        };
    }
    get expirationDate() {
        console.log(this.subscriptionDate);
        const expirationDate = this.subscriptionDate + (1000 * 3600 * 24 * 30);
        console.log(expirationDate);
        return expirationDate;
    }
    get getResponse() {
        const currentTime = Date.parse((new Date()).toISOString());
        const subscriptionStatus = currentTime < this.expirationDate ? 'ACTIVE' : 'EXPIRED';
        return {
            id: this._id,
            accountType: this.accountType,
            userId: this.userId,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            subscriptionStatus: subscriptionStatus,
            isVerified: this.isVerified,
            analytics: this.analytics
        };
    }
    get isUserSubscribed() {
        const currentTime = Date.parse((new Date()).toISOString());
        return (currentTime < this.expirationDate);
    }
}
class MultipleUserServiceDto {
    constructor(subUser) {
        this.userServices = subUser.userServices.map((userService) => new RaiderUserServiceDto(userService));
        this.totalUserServices = subUser.totalUserServices;
        this.hasNextPage = subUser.hasNextPage;
    }
    get getResponse() {
        return {
            userServices: this.userServices.map((userService) => userService.getResponse),
            totalUserServices: this.totalUserServices,
            hasNextPage: this.hasNextPage
        };
    }
}
exports.MultipleUserServiceDto = MultipleUserServiceDto;
exports.default = RaiderUserServiceDto;
