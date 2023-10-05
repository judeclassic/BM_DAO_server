const ethers = require("ethers");
import usdtABI from "./usdt_abi";

export class UsdtContractHandler {
    static intializeListener = (usdtAddress: string) => {
        // const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        const provider = new ethers.WebSocketProvider(`${process.env.ALCHEMY_WEBSOCKET}`);

        const contract = new ethers.Contract(usdtAddress, usdtABI, provider);
        contract.on("Transfer", (from: any, to: any, value: any, event: any) => {
            let info = {
                from: from,
                to: to,
                value: ethers.utils.formatUnits(value, 6),
                data: event,
            };
            console.log(JSON.stringify(info, null, 4));
        });
    }
}