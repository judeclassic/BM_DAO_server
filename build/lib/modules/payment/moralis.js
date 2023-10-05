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
const moralis_1 = __importDefault(require("moralis"));
const common_evm_utils_1 = __importDefault(require("@moralisweb3/common-evm-utils"));
const usdt_abi_1 = __importDefault(require("./usdt_abi"));
class PaymentRepository {
    constructor() {
        this.listenToPayment = () => {
            const EvmChain = common_evm_utils_1.default.EvmChain;
            const options = {
                chains: [EvmChain.ETHEREUM],
                description: "USDC Transfers 100k",
                tag: "usdcTransfers100k",
                includeContractLogs: true,
                abi: usdt_abi_1.default,
                topic0: ["Transfer(address,address,uint256)"],
                webhookUrl: "https://22be-2001-2003-f58b-b400-f167-f427-d7a8-f84e.ngrok.io/webhook",
                advancedOptions: [
                    {
                        topic0: "Transfer(address,address,uint256)",
                        filter: {
                            gt: ["value", "100000" + "".padEnd(6, "0")]
                        }
                    }
                ]
            };
            moralis_1.default.start({
                apiKey: process.env.MORALIS_KEY,
            }).then(() => __awaiter(this, void 0, void 0, function* () {
                const stream = yield moralis_1.default.Streams.add(options);
                const { id } = stream.toJSON();
                yield moralis_1.default.Streams.addAddress({
                    id: id,
                    address: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
                });
            }));
        };
    }
}
exports.default = PaymentRepository;
