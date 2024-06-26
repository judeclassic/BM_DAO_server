import { UserResponseInterface } from "../../../../types/dtos/user.dto";
import AutheticatedUserInterface from "../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../types/interfaces/response/response";
import { ITransaction } from "../../../../types/interfaces/response/transaction.response";
import UserProfileService from "./wallet.service";
import UserProfileValidator from "./wallet.validator";

class UserWalletController {
    private _userService: UserProfileService;
    private _userValidator: UserProfileValidator;

    constructor({ userService, userValidator }:{ userService: UserProfileService, userValidator: UserProfileValidator }) {
        this._userService = userService;
        this._userValidator = userValidator;
    }

    public getWalletInformation = async ({ user }: { user: AutheticatedUserInterface}, sendJson: (code: number, response: ResponseInterface<UserResponseInterface>)=>void)  => {
        const userResponse = await this._userService.getWalletInformation(user.id);
        if (!userResponse.user) return sendJson(401, { error: userResponse.errors, status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: userResponse.user.getResponse });
    }

    public fundUserWallet = async ({ user, body }: { user: AutheticatedUserInterface, body: { amount: number }}, sendJson: (code: number, response: ResponseInterface<ITransaction>)=>void)  => {
        if (!body.amount) return sendJson(403, { code: 403, status: false, error: [{message: 'please enter amount'}] });
    
        const transaction = await this._userService.fundUserWallet(user.id, body.amount );
        if (!transaction.data) return sendJson(401, { error: transaction.errors, status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: transaction.data.getResponse });
    }
    
    public withdrawUserWallet = async ({ user, body }: { user: AutheticatedUserInterface, body: { amount: number }}, sendJson: (code: number, response: ResponseInterface<ITransaction>)=>void)  => {
        if (!body.amount) return sendJson(403, { code: 403, status: false, error: [{message: 'please enter amount'}] });
    
        const transaction = await this._userService.withdrawUserWallet(user.id, body.amount);
        if (!transaction.data) return sendJson(401, { error: transaction.errors, status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: transaction.data.getResponse });
    }

    public getAllUserTransaction = async ({ user, query }: { user: any, query: { limit: number, page: number }}, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        if (!user.id) return sendJson(403, { code: 403, status: false });
    
        const foundUser = await this._userService.getAllUserTransaction(user.id, query);
        if (!foundUser.data) return sendJson(401, { error: [{message: 'User is not found'}], status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: foundUser.data.getResponse });
    }
}

export default UserWalletController;