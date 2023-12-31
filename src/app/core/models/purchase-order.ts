import { Plants } from './plants';
import { Products } from './products';
import { StorageLocations } from './storage-location';
import { Units } from './units';

export interface PurchaseOrderHeader{
    Id?:number;
    ERPPONumber:string;
    ERPPRNumber?:string;
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
    ApproverId?: number;
    IsApprovedByAll?: boolean;
    IsRejected?: boolean;
    RejectedBy?: number;
    RejectedDate?: Date;
    POPendingBy?: string;
    IsApprovalStart?: boolean;
    TotalNetPrice?: number;
    TotalTaxAmount?: number;
    TotalPOAmount?: number;
}

export interface PurchaseOrderDataVM{
    Id?:number;
    ERPPONumber?:string;
    DocType:string;
    SupplierId?:number;
    SupplierCode?:string;
    SupplierName?:string;
    PODate?:Date;
    PRHeaderId?:number;
    RFQHeaderId?:number;
    OAHeaderId?:number;
    ContractNumber?:string;
    CompanyCode?:string;
    TotalNetPrice?: number;
    TotalTaxAmount?: number;
    TotalPOAmount?: number;
    PlantId?: number;
    POLineItems:PurchaseOrderLine[];
}

export interface PurchaseOrderLine{
    Id:number;
    POLineId?:number;
    PRLineId?:number;
    ERPPRNumber?:string;
    // Product?:Products;
    ProductId?:number;
    Description?:string;
    ProductCode?:string;
    ProductGroup?:string;
    DeliveryDate?:Date;
    Qty?: number;
    Unit?: Units;
    UnitId?:number;
    NetPrice?:number;
    TotalNetPrice?:number;
    Currency?:string;
    HSNCode?:string;
    Tax?:number;
    TaxAmount?:number;
    TotalAmount?:number;
    StockType?:string;
    LocationCode?:string;
    LocationDescription?:string;
    // StorageLocation?: StorageLocations;
    StorageLocationId?: number;
    Plant?: Plants;
    PRDetId?: number;
    RFQDetId?: number;
    OADetId?: number;
    IsReturnItem?: boolean;
    IsFreeOfCharge?: boolean;
}

export interface PurchaseOrderDetailsVM{
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
    ApproverId?: number;
    IsApprovedByAll?: boolean;
    IsRejected?: boolean;
    RejectedBy?: number;
    RejectedDate?: Date;
    PRPendingBy?: string;
    IsApprovalStart?: boolean;
    TotalNetPrice?: number;
    TotalTaxAmount?: number;
    TotalPOAmount?: number;
    POLineItems:PurchaseOrderDetailsLine[];
    ContractNumber?:string;
}

export interface PurchaseOrderDetailsLine{
    Id?: number,
    POHeaderId: number,
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
    NetPrice?:number;
    TotalNetPrice?:number;
    Currency?:string;
    HSNCode?:string;
    GST?:number;
    IGST?:number;
    SGST?:number;
    CGST?:number;
    TaxAmount?:number;
    TotalAmount?:number;
    StockType?:string;
    PRDetId?: number;
    RFQDetId?: number;
    OADetId?: number;
    IsReturnItem?: boolean;
    IsFreeOfCharge?: boolean;
    IsSerialNo?: boolean;
    IsBatchNo?: boolean;
    IsASNGenerated?: boolean,
    IsGRGenerated?: boolean,
    IsInvoiceGenerated?: boolean,
    IsQualityChecked?: boolean,
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