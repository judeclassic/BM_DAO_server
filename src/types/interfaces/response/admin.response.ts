export enum AccessStatusEnum {
    ONE = 1,
    TWO = 2,
    THREE = 3,
}

interface AdminInterface {
    _id?: string;
    name: string;
    emailAddress: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    authenticationCode?: string;
    isVerified?: boolean;
    accessStatus: AccessStatusEnum
}

export default AdminInterface;