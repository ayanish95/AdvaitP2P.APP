import { Users } from './users';

export interface ApprovalTypes {
    Id: number;
    Type:string;
    DisplayText?:string;
    DocType?:string;
    DocTypeId?:number;
    Amount?:number;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsActive?: boolean;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
}

export interface ApprovalStrategy {
    Id: number;
    Sequence?:number;
    Role?:any;
    RoleId?:number;
    ApprovalType?:any;
    ApprovalTypeId?:number;
    ConfigurationFor?:string;
    User?:Users;
    UserId?:number;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsActive?: boolean;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
    IsEdit?:boolean;
}