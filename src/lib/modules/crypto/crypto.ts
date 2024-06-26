import Web3 from "web3";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ethers,} from 'ethers'

const YOUR_ANKR_PROVIDER_URL = process.env.ANKR_POLYGON_URL ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";

import { abi } from "./abi";
import { AnkrProvider } from "@ankr.com/ankr.js";
const contractAddress = process.env.CONTRACT_ADDRESS!
const masterWallet = process.env.MASTER_WALLET!
const secretKey= process.env.SECRET_KEY!

class CryptoRepository {
    private provider: Web3;
    private ankrProvider: AnkrProvider;
    ethProvider: ethers.providers.JsonRpcProvider;

    constructor () {
        this.provider = new Web3(new Web3.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.ankrProvider = new AnkrProvider(YOUR_ANKR_PROVIDER_URL);
        this.ethProvider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
    }

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => {
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
    }

    getGasPrices = async () => {
        try {
          const response = await axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
          if (response.data.status === "1") {
              return {
                  success: true,
                  gasPrices: {
                      low: response.data.result.SafeGasPrice,
                      average: response.data.result.ProposeGasPrice,
                      high: response.data.result.FastGasPrice
                  }
              };
          } else {
              return { success: false, message: response.data.result };
          }
        } catch (error) {
          console.error('Error fetching gas prices:', error);
          return { success: false, message: 'Error fetching gas prices' };
        }
  
    }

    getTokenPrice = async (walletAddress: string): Promise<string | null | undefined> => {
        try {
            const tokens = await this.ankrProvider.getAccountBalance({walletAddress, onlyWhitelisted: false});

            if (tokens.assets) {
                return tokens.assets.find(token => token.balance === contractAddress)?.balance;
            }
        } catch (err) {
          console.log(err)
            return undefined;
        }
    }

    createWallet =  () => {
        try {
            const account = this.provider.eth.accounts.create();

            return {
                address: account.address,
                private_key: this.encryptToken(account.privateKey),
            }
        } catch (err) {

            return undefined;
        }
    }

    deposit = async({address, private_key, amount}: {
        address: string
        private_key: string
        amount: number
    }) => {
        try {
            const WALLET_SECRET = this.decryptToken(private_key);
            const web3Provider = this.ethProvider;
            const wallet = new ethers.Wallet(WALLET_SECRET);
            const connectedWallet = wallet.connect(web3Provider);

            const contract = new ethers.Contract( contractAddress, abi, web3Provider);

            const gas = (await this.getGasPrices()).gasPrices?.high
            const transferAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

            const transfer = await contract.connect(connectedWallet).transfer(
                masterWallet,
                transferAmout,
                {
                gasPrice: ethers.utils.parseUnits( gas, 'gwei'), // Adjust the gas price
                }
            );

            const transferRes = await transfer.wait()

            return {
                amount: amount,
                address: address,
            }

        } catch (error) {
            return {
                error: 'unable carryout transaction'
            };
        }

    }

    withdrawal = async ({address, amount}: {
        address: string
        amount: number
    }) => {
        try{
            const web3Provider = this.ethProvider;
            const wallet = new ethers.Wallet(secretKey);
            const connectedWallet = wallet.connect(web3Provider);

            const contract = new ethers.Contract( contractAddress, abi, web3Provider);

            const gas = (await this.getGasPrices()).gasPrices?.high

            const transferAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

            const transfer = await contract.connect(connectedWallet).transfer(
                address,
                transferAmout,
            {
                gasPrice: ethers.utils.parseUnits( gas, 'gwei'), // Adjust the gas price
                }
            );

            const transferRes = await transfer.wait()

            return {
                amount: amount,
                address: address,
            }

        } catch (error) {
            return {
                error: 'unable carryout transaction'
            };
        }
    }
}

export default CryptoRepository