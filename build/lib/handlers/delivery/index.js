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
const category_enum_1 = require("../../../types/enums/products/category-enum");
const go_shiip_1 = __importDefault(require("./go_shiip"));
const loadDeliveryForStates_1 = require("./loadDeliveryForStates");
class DeliveryRepo {
    constructor() {
        this.deliverToUser = ({ order }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authData = yield this.goShiipIntegration.loginToUser();
                if (!authData.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                const shippingRate = yield this.goShiipIntegration.getShipmentRate({
                    accessToken: authData.data.token,
                    order: order
                });
                if (!(shippingRate === null || shippingRate === void 0 ? void 0 : shippingRate.data)) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                const bookShipment = yield this.goShiipIntegration.bookShipment({
                    accessToken: authData.data.token,
                    redis_key: shippingRate.data.redis_key,
                    userId: authData.data.user.id,
                    rateId: shippingRate.data.kwik_key
                });
                if (!bookShipment.data) {
                    return { status: false, error: 'unable to deliver your product, please contact admin' };
                }
                return { status: true, data: bookShipment.data };
            }
            catch (err) {
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
        this.goShiipIntegration = new go_shiip_1.default();
    }
}
exports.default = DeliveryRepo;
