export interface Products {
    Id:number;
    ProductCode:string;
    Description:string;
    ProductTypeId?:string;
    ProductCategoryId:string;
    ProductGroup:string;
    BaseUnit:string;
    PurchaseUnit:string;
    SalesUnit:string;
    PriceIndicator:string;
    StandardPrice:number;
    MovingAvgPrice:number;
    Currency:string;
    Plant:string;
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

export interface ProductGroup{
    Id:number;
    ProductGroupName:string;
    Description?:string;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    Extra1?: string;
    Extra2?: string;
    ProductFullName?:string;
}