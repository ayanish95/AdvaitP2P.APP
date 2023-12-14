export interface Products {
    Id:number;
    ProductCode?:string;
    Description?:string;
    ProductFullName?:string;
    ProductTypeId?:string;
    ProductCategoryId?:string;
    ProductGroup?:string;
    BaseUnit?:string;
    PurchaseUnit?:string;
    SalesUnit:string;
    Currency:string;
    GST?:number;
    Height?:number;
    Width?:number;
    Length?:number;
    Weight?:number;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
    ProductPlantMapping?:ProductPlantMapping[];
}

export interface ProductPlantMapping{
    SRNo?:number;
    Id?:number;
    PlantId?:number;
    PlantCode?:string;
    PlantName?:string;
    PriceIndicator?:string;
    StandardPrice:number;
    MovingAvgPrice:number;
    HSNCode?:string;
    IsBatchNo?: boolean;
    IsSerialNo?: boolean;
    IsDeleted?: boolean;
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