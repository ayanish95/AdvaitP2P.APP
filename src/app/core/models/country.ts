export interface Country {
    Id: number;
    CountryCode:string;
    Name?:string;
    CountryWithCode:string;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
}