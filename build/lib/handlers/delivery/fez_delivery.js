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
const axios_1 = __importDefault(require("axios"));
const category_enum_1 = require("../../../types/enums/products/category-enum");
const logger_1 = require("../../modules/logger");
const loadDeliveryForStates_1 = require("./loadDeliveryForStates");
const FEZCORPORATE_SECRET_KEY = process.env.FEZCORPORATE_SECRET_KEY;
const FEZCORPORATE_ID = process.env.FEZCORPORATE_ID;
const FEZCORPORATE_PASSWORD = process.env.FEZCORPORATE_PASSWORD;
const FEZCORPORATE_URL = process.env.FEZCORPORATE_URL;
class FezCoperateIntergration {
    constructor() {
        this.authenticateUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    user_id: FEZCORPORATE_ID,
                    password: FEZCORPORATE_PASSWORD
                };
                const config = {
                    method: 'post',
                    url: `${FEZCORPORATE_URL}/v1/user/authenticate`,
                    headers: {
                        secret_key: FEZCORPORATE_SECRET_KEY,
                        Authorization: `Bearer ${FEZCORPORATE_SECRET_KEY}`
                    },
                    data: data
                };
                const response = yield (0, axios_1.default)(config);
                if (!response.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                return { status: true, data: response.data };
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error: 'unable to deliver your product, please contact admin' };
            }
        });
        this.deliverToUser = ({ senderName, senderAddress, senderPhone, recipientAddress, recipientState, recipientName, recipientPhone, uniqueID, isLarge }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [{
                        thirdparty: true,
                        senderName,
                        senderAddress,
                        senderPhone,
                        recipientAddress,
                        recipientState,
                        recipientName,
                        recipientPhone,
                        uniqueID,
                        isLarge,
                        BatchID: '2'
                    }];
                const authData = yield this.authenticateUser();
                const authToken = authData.data.authDetails.authToken;
                const config = {
                    method: 'post',
                    url: `${FEZCORPORATE_URL}/v1/order`,
                    headers: {
                        "secret-key": FEZCORPORATE_SECRET_KEY,
                        "Authorization": `Bearer ${authToken}`
                    },
                    data: data
                };
                const response = yield (0, axios_1.default)(config);
                if (!response.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                return { status: true, data: response.data };
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error: 'unable to deliver your product, please contact admin' };
            }
        });
        this.getDevileryPriceForState = ({ state, type }) => {
            const price = (0, loadDeliveryForStates_1.generateOrderPriceFor)(state);
            if ((type === category_enum_1.FixedCategoryEnum.cake))
                return price.cake;
            return price.orders;
        };
        this.name = 'SS';
    }
}
exports.default = FezCoperateIntergration;
