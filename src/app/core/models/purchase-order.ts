import { Company } from './company';
import { Plants } from './plants';
import { Products } from './products';
import { StorageLocations } from './storage-location';
import { Suppliers } from './suppliers';
import { Units } from './units';

export interface PurchaseOrderVM{
    Id?:number;
    ERPPONumber?:string;
    DocType:string;
    SupplierId?:number;
    Supplier?:Suppliers;
    PODate?:Date;
    PRHeaderId?:number;
    RFQHeaderId?:number;
    OAHeaderId?:number;
    ContractNumber?:string;
    CompanyCode?:string;
    Company?:Company;
    PlantId?: number;
    Plant?:Plants;
    TotalNetPrice?: number;
    TotalTaxAmount?: number;
    TotalPOAmount?: number;
    ERPPRNumber?:string;
    POPendingBy?: string;
    ApproverId?: number;
    IsApprovedByAll?: boolean;
    CreatedOn?:Date;
    CreatedBy?:number;
    UpdatedBy?:number;
    UpdatedOn?:Date;
    IsActive?:boolean;
    IsDeleted?:boolean;
    DeletedOn?:Date;
    IsRejected?: boolean;
    RejectedBy?: number;
    RejectedDate?: Date;
    IsApprovalStart?: boolean;
    Extra1?:string;
    Extra2?:string;
    POLineItems:PurchaseOrderLineVM[];
}

export interface PurchaseOrderLineVM{
    Id:number;
    POLineId?:number;
    PRHeaderId?:number;
    PRLineId?:number;
    ERPPRNumber?:string;
    ProductId?:number;
    Product?:Products;
    DeliveryDate?:Date;
    Qty?: number;
    OpenGRQty?: number;
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
    StorageLocation?: StorageLocations;
    StorageLocationId?: number;
    PRDetId?: number;
    RFQDetId?: number;
    OADetId?: number;
    IsReturnItem?: boolean;
    IsFreeOfCharge?: boolean;
    POHeaderId?: number,
    IsSerialNo?: boolean;
    IsBatchNo?: boolean;
    IsASNGenerated?: boolean,
    IsGRGenerated?: boolean,
    IsInvoiceGenerated?: boolean,
    IsQualityChecked?: boolean,
    IsActive?: boolean,
    CreatedBy?: number,
    CreatedOn?: Date,
    UpdatedBy?: number,
    UpdatedOn?: Date,
    IsDeleted?: boolean,
    DeletedOn?: Date,
    Extra1?: string,
    Extra2?: string,
}