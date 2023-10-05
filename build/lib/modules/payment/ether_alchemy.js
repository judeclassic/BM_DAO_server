"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsdtContractHandler = void 0;
const ethers = require("ethers");
const usdt_abi_1 = __importDefault(require("./usdt_abi"));
class UsdtContractHandler {
}
UsdtContractHandler.intializeListener = (usdtAddress) => {
    // const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const provider = new ethers.WebSocketProvider(`${process.env.ALCHEMY_WEBSOCKET}`);
    const contract = new ethers.Contract(usdtAddress, usdt_abi_1.default, provider);
    contract.on("Transfer", (from, to, value, event) => {
        let info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, 6),
            data: event,
        };
        console.log(JSON.stringify(info, null, 4));
    });
};
exports.UsdtContractHandler = UsdtContractHandler;
