"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raiders_dto_1 = __importDefault(require("../../../../types/dtos/service/raiders.dto"));
const user_response_1 = require("../../../../types/interfaces/response/user.response");
const user_dto_1 = require("../../../../types/dtos/user.dto");
const ERROR_UNABLE_TO_REWARD_USER = {
    message: 'could not update user with referral',
};
const ERROR_USER_NOT_FOUND = {
    message: 'user with auth not exist.',
};
const ERROR_NOT_ENOUGH_BALANCE = {
    message: 'user do not have enough balance please recharge',
};
const ERROR_THIS_USERSERVICE_DO_NOT_EXIST = {
    message: 'user have not subscribed for this service',
};
const ERROR_THIS_USERSERVICE_DO_NOT_BELONG_TO_USER = {
    message: 'user do not own this service',
};
const ERROR_UNABLE_TO_CREATE_USER_SERVICE = {
    message: 'Unable to save user data on DB',
};
const ERROR_ALREADY_HAVE_THIS_ACCOUNT = {
    message: 'user have already suscribed the service',
};
const ERROR_THIS_USER_SUBSCRIPTION_IS_ACTIVE = {
    message: 'the subscription for this service has not expired',
};
const ERROR_USER_IS_A_CLIENT = {
    message: 'user is a client, unable to subscribe service',
};
class RaiderUserServiceService {
    constructor({ authRepo, userModel, userServiceModel }) {
        this.subscribeForAService = ({ accountType, userId, }) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (((_a = user.data) === null || _a === void 0 ? void 0 : _a.accountType) === user_response_1.AccountTypeEnum.client)
                return { errors: [ERROR_USER_IS_A_CLIENT] };
            const userServiceExists = yield this._userServiceModel.checkIfExist({ userId, accountType });
            if (userServiceExists.data)
                return { errors: [ERROR_ALREADY_HAVE_THIS_ACCOUNT] };
            user.data.referal.isGiven = true;
            const isWithdrawed = user.data.updateUserWithdrawableBalance({ amount: user_dto_1.AmountEnum.subscriptionPackage1, type: 'charged' });
            if (!isWithdrawed)
                return { errors: [ERROR_NOT_ENOUGH_BALANCE] };
            const userServiceRequest = {
                accountType: accountType,
                userId: userId,
                updatedAt: new Date(),
                createdAt: new Date(),
                subscriptionDate: Date.parse((new Date()).toISOString()),
                isVerified: false,
                work_timeout: Date.parse((new Date()).toISOString()),
                tasks: [],
            };
            const userServiceResponse = yield this._userServiceModel.createUserService(userServiceRequest);
            if (!userServiceResponse.data)
                return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };
            const updateUser = yield this._userModel.updateUserDetailToDB(user.data.id, user.data.getDBModel);
            if (!updateUser.data)
                return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };
            this.adwardReferals(updateUser.data.referal);
            return { userService: userServiceResponse.data };
        });
        this.resubscribeAService = ({ userId, userServiceId }) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (((_b = user.data) === null || _b === void 0 ? void 0 : _b.accountType) === user_response_1.AccountTypeEnum.client)
                return { errors: [ERROR_USER_IS_A_CLIENT] };
            const userService = yield this._userServiceModel.checkIfExist({ _id: userServiceId });
            if (!userService.data)
                return { errors: [ERROR_THIS_USERSERVICE_DO_NOT_EXIST] };
            if (userService.data.isUserSubscribed)
                return { errors: [ERROR_THIS_USER_SUBSCRIPTION_IS_ACTIVE] };
            if (userService.data.userId !== userId)
                return { errors: [ERROR_THIS_USERSERVICE_DO_NOT_BELONG_TO_USER] };
            const isWithdrawed = user.data.updateUserWithdrawableBalance({ amount: user_dto_1.AmountEnum.subscriptionPackage1, type: 'charged' });
            if (!isWithdrawed)
                return { errors: [ERROR_NOT_ENOUGH_BALANCE] };
            const updateUser = yield this._userModel.updateUserDetailToDB(user.data.id, user.data.getDBModel);
            if (!updateUser.data)
                return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };
            return { userService: userService.data };
        });
        this.listAllUserServices = (userId, { page, limit }) => __awaiter(this, void 0, void 0, function* () {
            const userServices = yield this._userServiceModel.getAllUserService({ userId }, { page, limit });
            if (userServices.error || !userServices.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            return { userServices: userServices.data };
        });
        this.unsubscribeFromUserService = (userId, userServiceId, password) => __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this._userModel.checkIfExist({ _id: userId });
            if (!userExists.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const passwordIsValid = this._authRepo.comparePassword(password, userExists.data.password);
            if (!passwordIsValid)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const userService = yield this._userServiceModel.deleteUserService(userServiceId);
            if (!userService.data) {
                return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };
            }
            const userDto = new raiders_dto_1.default(userService.data);
            return { userService: userDto };
        });
        this.adwardReferals = ({ referalCode1, referalCode2, referalCode3, isGiven }) => __awaiter(this, void 0, void 0, function* () {
            if (isGiven)
                return;
            const response1 = yield this.adwardReferal(user_dto_1.AmountPercentageEnum.referal1, referalCode1);
            if (!response1.status)
                return response1;
            const response2 = yield this.adwardReferal(user_dto_1.AmountPercentageEnum.referal2, referalCode2);
            if (!response2.status)
                return response2;
            const response3 = yield this.adwardReferal(user_dto_1.AmountPercentageEnum.referal3, referalCode3);
            if (!response3.status)
                return response3;
        });
        this.adwardReferal = (percentage, referalCode) => __awaiter(this, void 0, void 0, function* () {
            if (referalCode) {
                const userWith1stReferalExists = yield this._userModel.checkIfReferalExist({ myReferalCode: referalCode });
                if (userWith1stReferalExists.data) {
                    userWith1stReferalExists.data.updateReferalBalance({ amount: user_dto_1.AmountEnum.subscriptionPackage1, percentage });
                    const updateUserWith1stReferal = yield this._userModel.updateUserDetailToDB(userWith1stReferalExists.data.id, userWith1stReferalExists.data.getDBModel);
                    if (!updateUserWith1stReferal.data)
                        return { status: false, errors: [ERROR_UNABLE_TO_REWARD_USER] };
                }
            }
            return { status: true };
        });
        this._authRepo = authRepo;
        this._userModel = userModel;
        this._userServiceModel = userServiceModel;
    }
}
exports.default = RaiderUserServiceService;
