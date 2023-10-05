"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletDto = exports.AmountEnum = exports.AmountPercentageEnum = void 0;
var AmountPercentageEnum;
(function (AmountPercentageEnum) {
    AmountPercentageEnum[AmountPercentageEnum["total"] = 100] = "total";
    AmountPercentageEnum[AmountPercentageEnum["referal1"] = 15] = "referal1";
    AmountPercentageEnum[AmountPercentageEnum["referal2"] = 7] = "referal2";
    AmountPercentageEnum[AmountPercentageEnum["referal3"] = 3] = "referal3";
})(AmountPercentageEnum = exports.AmountPercentageEnum || (exports.AmountPercentageEnum = {}));
var AmountEnum;
(function (AmountEnum) {
    AmountEnum[AmountEnum["subscriptionPackage1"] = 10] = "subscriptionPackage1";
    AmountEnum[AmountEnum["moderatorSubscriptionPackage1"] = 50] = "moderatorSubscriptionPackage1";
    AmountEnum[AmountEnum["raidUserPay1"] = 0.02] = "raidUserPay1";
    AmountEnum[AmountEnum["raidUserPay2"] = 0.04] = "raidUserPay2";
    AmountEnum[AmountEnum["raidClientCharge1"] = 0.03] = "raidClientCharge1";
    AmountEnum[AmountEnum["raidClientCharge2"] = 0.06] = "raidClientCharge2";
})(AmountEnum = exports.AmountEnum || (exports.AmountEnum = {}));
class WalletDto {
    constructor(wallet) {
        this.balance = wallet.balance;
    }
    get getModel() {
        return {
            balance: this.balance,
        };
    }
    get getResponse() {
        return {
            balance: this.balance,
        };
    }
}
exports.WalletDto = WalletDto;
class UserDto {
    constructor(user) {
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
        this.updateReferalBalance = ({ amount, percentage }) => {
            this.wallet.balance.referalBonus = this.wallet.balance.referalBonus + (amount * percentage / 100);
            this.wallet.balance.totalBalance = this.wallet.balance.totalBalance + (amount * percentage / 100);
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
            authenticationCode: this.authenticationCode
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
            authenticationCode: this.authenticationCode
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
            referal: { myReferalCode: this.referal.myReferalCode },
            country: this.country,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
        };
    }
    get getUnSecureResponse() {
        return {
            accountType: this.accountType,
            id: this.id,
            username: this.username,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            isVerified: this.isVerified,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
        };
    }
}
exports.default = UserDto;
