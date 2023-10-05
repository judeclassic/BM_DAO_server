export enum AccountTypeEnum {
    user = 'user',
    client = 'client',
}

export interface IWallet {
    balance: {
        referalBonus: number;
        taskBalance: number;
        walletBalance: number;
        totalBalance: number;
    };
}

export interface IUser {
    _id?: string;
    accountType: AccountTypeEnum;
    name: string;
    username: string;
    emailAddress: string;
    phoneNumber?: string;
    country?: string;
    referal: {
        isGiven: boolean;
        myReferalCode: string;
        referalCode1?: string;
        referalCode2?: string;
        referalCode3?: string;
    };
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    isVerified?: boolean;
    wallet: IWallet;
    authenticationCode?: string;
}