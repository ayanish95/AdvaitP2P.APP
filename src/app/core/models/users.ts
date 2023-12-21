import { Plants } from './plants';

export interface Users {
    Id: number;
    FirstName: string;
    LastName: string;
    UserName: string;
    Password?: string;
    ERPUserId?: string;
    Mobile?: string;
    Email?: string;
    Pincode?: string;
    RoleId?: string;
    RoleName?: string;
    ForceReset?: string;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
    SupplierId?: number;
    PlantId?:number[];
    Plants?:Plants[];
}

export interface LoginUser {
    UserName: string;
    Password: string;
    Otp?: any;
    OtpCode: string;
}
export class Otp {
    UserId!: string;
    OtpType!: string;
    OtpCode!: string;
    IsUsed!: string;
    ExpiredOn!: string;
}