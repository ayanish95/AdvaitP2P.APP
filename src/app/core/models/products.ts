export interface Products {
    Id:number;
    ProductCode:string;
    Description:string;
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