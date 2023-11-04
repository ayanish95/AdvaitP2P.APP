import { Plants } from "./plants";
import { Products } from "./products";
import { StorageLocations } from "./storage-location";
import { Units } from "./units";

export interface PurchaseOrderHeader{
    Id?:number;
    ERPPONumber:string;
    DocType:string;
    SupplierId?:number;
    SupplierCode?:string;
    SupplierName?:string;
    PODate?:Date;
    CompanyCode?:string;
    PRHeaderId?:number;
    RFQHeaderId?:number;
    OAHeaderId?:number;
    CreatedBy?:number;
    CreatedOn?:Date;
    UpdatedBy?:number;
    UpdatedOn?:Date;
    IsActive?:boolean;
    IsDeleted?:boolean;
    DeletedOn?:Date;
    Extra1:string;
    Extra2:string;
}

export interface PurchaseOrderLine{
    Id:number;
    LineId?:number;
    Product?:Products;
    Description?:string;
    ProductGroup?:string;
    DeliveryDate?:Date;
    Plant?: Plants;
    Qty?: number;
    StorageLocation?: StorageLocations;
    Unit?: Units;
}

export interface PurchaseOrderDetailsLine{
    Id?: number,
    PRHeaderId: number,
    ProductId: number,
    ProductCode: string,
    ProductDescription: string,
    ProductGroup: string,
    Qty: number,
    DeliveryDate: Date,
    UnitId: number,
    UnitName: string,
    UnitDescription: string,
    PlantId: number,
    PlantCode: string,
    PlantDescription: string,
    StorageLocationId: number,
    LocationCode: string,
    LocationDescription: string,
    IsActive: boolean,
    CreatedBy: number,
    CreatedOn: Date,
    UpdatedBy: number,
    UpdatedOn: Date,
    IsDeleted: true,
    DeletedOn: Date,
    Extra1: string,
    Extra2: string,
}