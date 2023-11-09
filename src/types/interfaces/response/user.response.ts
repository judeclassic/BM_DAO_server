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

export interface IAnalytics {
    totalUploaded: number;
    totalCompleted: number;
    raiders: {
        totalUploaded: number;
        totalCompleted: number;
    },
    moderators: {
        totalUploaded: number;
        totalCompleted: number;
    },
    chatEngagers: {
        totalUploaded: number;
        totalCompleted: number;
    },
    collabManagers: {
        totalUploaded: number;
        totalCompleted: number;
    }
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
        analytics: {
            totalAmount: number,
            totalEarned: number
            level1: {
                amount: number,
                earned: number
            }
            level2: {
                amount: number,
                earned: number
            }
            level3: {
                amount: number,
                earned: number
            }
        }
    };
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    isVerified?: boolean;
    wallet: IWallet;
    authenticationCode?: string;
    analytics?: IAnalytics;
}