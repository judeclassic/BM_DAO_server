"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletDto = exports.AmountEnum = exports.AmountPercentageEnum = void 0;
var AmountPercentageEnum;
(function (AmountPercentageEnum) {
    AmountPercentageEnum[AmountPercentageEnum["total"] = 100] = "total";
    AmountPercentageEnum[AmountPercentageEnum["referal1"] = 20] = "referal1";
    AmountPercentageEnum[AmountPercentageEnum["referal2"] = 10] = "referal2";
    AmountPercentageEnum[AmountPercentageEnum["referal3"] = 10] = "referal3";
})(AmountPercentageEnum = exports.AmountPercentageEnum || (exports.AmountPercentageEnum = {}));
var AmountEnum;
(function (AmountEnum) {
    AmountEnum[AmountEnum["subscriptionPackage1"] = 5] = "subscriptionPackage1";
    AmountEnum[AmountEnum["moderatorSubscriptionPackage1"] = 50] = "moderatorSubscriptionPackage1";
    AmountEnum[AmountEnum["raidClientFollowCharge"] = 0.015] = "raidClientFollowCharge";
    AmountEnum[AmountEnum["raidClientRaidCharge"] = 0.3] = "raidClientRaidCharge";
    AmountEnum[AmountEnum["raidClientLikeCharge"] = 0.01] = "raidClientLikeCharge";
    AmountEnum[AmountEnum["raidClientTweetCharge"] = 0.25] = "raidClientTweetCharge";
    AmountEnum[AmountEnum["raidClientCommentCharge"] = 0.1] = "raidClientCommentCharge";
    AmountEnum[AmountEnum["raidClientRetweetCharge"] = 0.2] = "raidClientRetweetCharge";
    AmountEnum[AmountEnum["raidRaiderFollowPay"] = 0.007] = "raidRaiderFollowPay";
    AmountEnum[AmountEnum["raidRaiderRaidPay"] = 0.15] = "raidRaiderRaidPay";
    AmountEnum[AmountEnum["raidRaiderLikePay"] = 0.005] = "raidRaiderLikePay";
    AmountEnum[AmountEnum["raidRaiderTweetPay"] = 0.1] = "raidRaiderTweetPay";
    AmountEnum[AmountEnum["raidRaiderCommentpay"] = 0.05] = "raidRaiderCommentpay";
    AmountEnum[AmountEnum["raidRaiderRetweetpay"] = 0.1] = "raidRaiderRetweetpay";
    AmountEnum[AmountEnum["raidModeratorFollowPay"] = 0.002] = "raidModeratorFollowPay";
    AmountEnum[AmountEnum["raidModeratorRaidPay"] = 0.03] = "raidModeratorRaidPay";
    AmountEnum[AmountEnum["raidModeratorLikePay"] = 0.001] = "raidModeratorLikePay";
    AmountEnum[AmountEnum["raidModeratorTweetPay"] = 0.05] = "raidModeratorTweetPay";
    AmountEnum[AmountEnum["raidModeratorCommentpay"] = 0.01] = "raidModeratorCommentpay";
    AmountEnum[AmountEnum["raidModeratorRetweetpay"] = 0.02] = "raidModeratorRetweetpay";
    AmountEnum[AmountEnum["chatterCharge"] = 0.7] = "chatterCharge";
    AmountEnum[AmountEnum["chatterPay"] = 0.5] = "chatterPay";
})(AmountEnum = exports.AmountEnum || (exports.AmountEnum = {}));
class WalletDto {
    constructor(wallet) {
        this.balance = wallet.balance;
        this.wallet = wallet.wallet;
    }
    get getModel() {
        var _a, _b;
        return {
            balance: this.balance,
            wallet: {
                address: (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.address,
                privateKey: (_b = this.wallet) === null || _b === void 0 ? void 0 : _b.privateKey,
            }
        };
    }
    get getResponse() {
        var _a;
        return {
            balance: this.balance,
            wallet: {
                address: (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.address,
            }
        };
    }
}
exports.WalletDto = WalletDto;
class UserDto {
    constructor(user) {
        this.referals = [];
        this.toTokens = () => {
            return {
                accountType: this.accountType,
                accessToken: this.accessToken,
            };
        };
        this.updateUserWithdrawableBalance = ({ amount, multiplier = 1, type }) => {
            if (type === 'charged') {
                this.wallet.balance.walletBalance -= (amount * multiplier);
                this.wallet.balance.totalBalance -= (amount * multiplier);
                return (this.wallet.balance.walletBalance > 0);
            }
            this.wallet.balance.walletBalance += (amount * multiplier);
            this.wallet.balance.totalBalance += (amount * multiplier);
            return (this.wallet.balance.walletBalance > 0);
        };
        this.updateReferalBalance = ({ amount, percentage, level }) => {
            this.wallet.balance.referalBonus = this.wallet.balance.referalBonus + (amount * percentage / 100);
            this.wallet.balance.totalBalance = this.wallet.balance.totalBalance + (amount * percentage / 100);
            this.referal.analytics.totalAmount += 1;
            this.referal.analytics.totalEarned += (amount * percentage / 100);
            if (level === 1) {
                this.referal.analytics.level1.amount += 1;
                this.referal.analytics.level1.earned += (amount * percentage / 100);
            }
            if (level === 2) {
                this.referal.analytics.level2.amount += 1;
                this.referal.analytics.level2.earned += (amount * percentage / 100);
            }
            if (level === 3) {
                this.referal.analytics.level3.amount += 1;
                this.referal.analytics.level3.earned += (amount * percentage / 100);
            }
        };
        this.id = user._id;
        this.accountType = user.accountType;
        this.name = user.name;
        this.username = user.username;
        this.emailAddress = user.emailAddress;
        this.phoneNumber = user.phoneNumber;
        this.country = user.country;
        this.password = user.password;
        this.updatedAt = user.updatedAt;
        this.createdAt = user.createdAt;
        this.accessToken = user.accessToken;
        this.isVerified = user.isVerified;
        this.wallet = new WalletDto(user.wallet);
        this.referal = user.referal;
        this.authenticationCode = user.authenticationCode;
        this.analytics = user.analytics;
    }
    get getUserForToken() {
        var _a;
        return {
            id: this.id,
            username: this.name,
            email: this.emailAddress,
            createdAt: (_a = this.createdAt) === null || _a === void 0 ? void 0 : _a.toString(),
        };
    }
    get getModel() {
        return {
            _id: this.id,
            accountType: this.accountType,
            name: this.name,
            username: this.username,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            country: this.country,
            password: this.password,
            accessToken: this.accessToken,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            wallet: this.wallet.getModel,
            referal: this.referal,
            authenticationCode: this.authenticationCode,
            analytics: this.analytics
        };
    }
    get getDBModel() {
        return {
            accountType: this.accountType,
            name: this.name,
            username: this.username,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            country: this.country,
            password: this.password,
            accessToken: this.accessToken,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            wallet: this.wallet.getModel,
            referal: this.referal,
            authenticationCode: this.authenticationCode,
            analytics: this.analytics
        };
    }
    get getResponse() {
        return {
            accountType: this.accountType,
            id: this.id,
            name: this.name,
            username: this.username,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            accessToken: this.accessToken,
            wallet: this.wallet.getResponse,
            referal: { myReferalCode: this.referal.myReferalCode, analytics: this.referal.analytics },
            country: this.country,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            raiderService: this.raiderService,
            moderatorService: this.moderatorService,
            referals: this.referals,
            analytics: this.analytics
        };
    }
    get getUnSecureResponse() {
        return {
            accountType: this.accountType,
            id: this.id,
            name: this.name,
            username: this.username,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            referal: this.referal,
            analytics: this.analytics
        };
    }
}
exports.default = UserDto;
