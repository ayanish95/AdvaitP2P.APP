export interface Users {
    Id: number;
    FirstName: string;
    LastName: string;
    UserName: string;
    Password: string;
    ERPUserId?: string;
    Mobile?: string;
    Email?: string;
    Pincode?: string;
    RoleId?: string;
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
    SupplierId?:number;
}