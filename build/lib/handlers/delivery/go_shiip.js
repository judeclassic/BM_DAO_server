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
const GOSHIIP_SECRET_KEY = process.env.GOSHIIP_SECRET_KEY;
const GOSHIIP_ID = process.env.GOSHIIP_ID;
const GOSHIIP_PASSWORD = process.env.GOSHIIP_PASSWORD;
const GOSHIIP_URL = process.env.GOSHIIP_URL;
class GoShiipIntegration {
    constructor() {
        this.loginToUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email_phone: GOSHIIP_ID,
                    password: GOSHIIP_PASSWORD
                };
                const options = {
                    method: 'POST',
                    url: `${GOSHIIP_URL}/api/v2/auth/login`,
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    data,
                };
                const response = yield (0, axios_1.default)(options);
                if (!response.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                return { status: true, data: response.data.data };
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error: 'unable to deliver your product, please contact admin' };
            }
        });
        this.getShipmentRate = ({ accessToken, order }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    method: 'POST',
                    url: `${GOSHIIP_URL}/api/v2/tariffs/allprice`,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    data: {
                        "type": "local",
                        "items": [
                            {
                                "category": order.product.category,
                                "name": order.product.name,
                                "quantity": order.amount,
                                "weight_id": 3,
                                "weight": 0.5,
                                "height": 1.57,
                                "width": 1.57,
                                "length": 1.57,
                                "amount": "23",
                                "description": order.product.description,
                                "pickup_date": order.deliveryDate
                            }
                        ],
                        "parcels": {
                            "weight": 1.5,
                            "length": 1.57,
                            "height": 1.57,
                            "width": 1.57,
                            "date": "2021-06-21 09:25"
                        },
                        "fromAddress": {
                            "name": order.store.name,
                            "email": "justclassic24@gmail.com",
                            "phone": order.store.phoneNumber,
                            "country": order.store.country,
                            "country_code": "NG",
                            "state": order.store.state,
                            "city": order.store.state,
                            "zip": "110212",
                            "address": `${order.store.streetAddress}, ${order.store.state}, ${order.store.country}`,
                            "latitude": "6.4377149",
                            "longitude": "3.523846"
                        },
                        "toAddress": {
                            "name": order.buyer.username,
                            "email": order.buyer.email,
                            "phone": order.buyer.phoneNumber,
                            "country": "Nigeria",
                            "country_code": "NG",
                            "state": order.location.state,
                            "city": order.location.state,
                            "zip": "110212",
                            "address": `${order.location.streetAddress}, ${order.location.state}, ${order.location.country}`,
                            "latitude": "6.4505444",
                            "longitude": "3.4706713"
                        },
                    }
                };
                const response = yield (0, axios_1.default)(options);
                if (!response.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                const gokada = response.data.data.rates.find((rate) => { var _a; return ((_a = rate.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'gokada'; });
                const kwik = response.data.data.rates.find((rate) => { var _a; return ((_a = rate.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'kwik'; });
                const uber = response.data.data.rates.find((rate) => { var _a; return ((_a = rate.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'uber'; });
                const rateId = (order.product.category === category_enum_1.FixedCategoryEnum.cake) ? uber.id : gokada.id;
                return { status: true, data: {
                        redis_key: response.data.data.redis_key,
                        kwik_key: response.data.data.kwik_key,
                        rateId: rateId,
                    } };
            }
            catch (error) {
                console.log(error);
                logger_1.defaultLogger.error(error);
                return { status: false, error: 'unable to deliver your product, please contact admin' };
            }
        });
        this.bookShipment = ({ accessToken, redis_key, userId, rateId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    method: 'POST',
                    url: `${GOSHIIP_URL}/api/v2/shipments`,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    data: {
                        redis_key: redis_key,
                        user_id: userId,
                        rate_id: rateId,
                        platform: 'web2'
                    }
                };
                const response = yield (0, axios_1.default)(options);
                console.log(response);
                if (!response.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                return { status: true, data: response.data.data };
            }
            catch (error) {
                console.log(error);
                logger_1.defaultLogger.error(error);
                return { status: false, error: 'unable to deliver your product, please contact admin' };
            }
        });
        this.assignShipment = ({ shipmentId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    user_id: GOSHIIP_ID,
                    password: GOSHIIP_PASSWORD
                };
                const options = {
                    method: 'POST',
                    url: `${GOSHIIP_URL}/api/v2/shipments/externalAssignment/${shipmentId}`,
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    data: {
                        redis_key: 'edc6c442-c0ea-472d-9427-00c441c5b94e',
                        user_id: 14,
                        rate_id: '4f0d621c-4e55-40f8-aab8-45e7ca374fac',
                        platform: 'web2'
                    }
                };
                const response = yield (0, axios_1.default)(options);
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
    }
}
exports.default = GoShiipIntegration;
