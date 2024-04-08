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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const YOUR_ANKR_PROVIDER_URL = (_a = process.env.ANKR_POLYGON_URL) !== null && _a !== void 0 ? _a : "";
const ETHERSCAN_API_KEY = (_b = process.env.ETHERSCAN_API_KEY) !== null && _b !== void 0 ? _b : "";
const abi_1 = require("./abi");
const ankr_js_1 = require("@ankr.com/ankr.js");
const contractAddress = process.env.CONTRACT_ADDRESS;
const masterWallet = process.env.MASTER_WALLET;
const secretKey = process.env.SECRET_KEY;
class CryptoRepository {
    constructor() {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.getGasPrices = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
                if (response.data.status === "1") {
                    return {
                        success: true,
                        gasPrices: {
                            low: response.data.result.SafeGasPrice,
                            average: response.data.result.ProposeGasPrice,
                            high: response.data.result.FastGasPrice
                        }
                    };
                }
                else {
                    return { success: false, message: response.data.result };
                }
            }
            catch (error) {
                console.error('Error fetching gas prices:', error);
                return { success: false, message: 'Error fetching gas prices' };
            }
        });
        this.getTokenPrice = (walletAddress) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tokens = yield this.ankrProvider.getAccountBalance({ walletAddress, onlyWhitelisted: false });
                if (tokens.assets) {
                    return (_a = tokens.assets.find(token => token.balance === contractAddress)) === null || _a === void 0 ? void 0 : _a.balance;
                }
            }
            catch (err) {
                console.log(err);
                return undefined;
            }
        });
        this.createWallet = () => {
            try {
                const account = this.provider.eth.accounts.create();
                return {
                    address: account.address,
                    private_key: this.encryptToken(account.privateKey),
                };
            }
            catch (err) {
                return undefined;
            }
        };
        this.deposit = ({ address, private_key, amount }) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const WALLET_SECRET = this.decryptToken(private_key);
                const web3Provider = this.ethProvider;
                const wallet = new ethers_1.ethers.Wallet(WALLET_SECRET);
                const connectedWallet = wallet.connect(web3Provider);
                const contract = new ethers_1.ethers.Contract(contractAddress, abi_1.abi, web3Provider);
                const gas = (_b = (yield this.getGasPrices()).gasPrices) === null || _b === void 0 ? void 0 : _b.high;
                const transferAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                const transfer = yield contract.connect(connectedWallet).transfer(masterWallet, transferAmout, {
                    gasPrice: ethers_1.ethers.utils.parseUnits(gas, 'gwei'), // Adjust the gas price
                });
                const transferRes = yield transfer.wait();
                return {
                    amount: amount,
                    address: address,
                };
            }
            catch (error) {
                return {
                    error: 'unable carryout transaction'
                };
            }
        });
        this.withdrawal = ({ address, amount }) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            try {
                const web3Provider = this.ethProvider;
                const wallet = new ethers_1.ethers.Wallet(secretKey);
                const connectedWallet = wallet.connect(web3Provider);
                const contract = new ethers_1.ethers.Contract(contractAddress, abi_1.abi, web3Provider);
                const gas = (_c = (yield this.getGasPrices()).gasPrices) === null || _c === void 0 ? void 0 : _c.high;
                const transferAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                const transfer = yield contract.connect(connectedWallet).transfer(address, transferAmout, {
                    gasPrice: ethers_1.ethers.utils.parseUnits(gas, 'gwei'), // Adjust the gas price
                });
                const transferRes = yield transfer.wait();
                return {
                    amount: amount,
                    address: address,
                };
            }
            catch (error) {
                return {
                    error: 'unable carryout transaction'
                };
            }
        });
        this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.ankrProvider = new ankr_js_1.AnkrProvider(YOUR_ANKR_PROVIDER_URL);
        this.ethProvider = new ethers_1.ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
    }
}
exports.default = CryptoRepository;
