
export enum TokenType {
    accessToken = 'ACCESS_TOKEN_SECRET',
    adminAccessToken = 'ADMIN_ACCESS_TOKEN_SECRET',
    refreshToken = 'REFRESH_TOKEN_SECRET',
    resetPassword = 'RESET_PASSWORD_SECRET',
    emailVerification = 'EMAIL_VERIFICATION_SECRET'
}

interface BearerToken {
    status: boolean,
    error?: string,
    data?: any,
}

interface AuthorizationInterface {
    generateVerificationCode: (numb: number) => string;

    generateCode: (numb: number) => string;

    encryptToken: (data: any, type: TokenType) => string;

    decryptToken: (data: string, type: TokenType) => any;

    createSpecialKey: ({prefix, suffix, removeDashes}: {prefix?: string, suffix?: string, removeDashes?: boolean}) => string;

    verifyBearerToken: (data: string, type: TokenType) => BearerToken;

    encryptPassword: (password: string) => string;

    comparePassword: (password: string, userPassword :string) => boolean;
}

export default AuthorizationInterface;