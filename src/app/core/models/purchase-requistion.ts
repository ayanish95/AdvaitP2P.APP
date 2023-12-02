import { Plants } from './plants';
import { Products } from './products';
import { StorageLocations } from './storage-location';
import { Units } from './units';

export interface PurchaseRequisitionHeader{
    Id: number;
    ERPPRNumber?:string;
    PRDocType?:string;
    PRDate?:Date;
    PRToRFQ?: boolean;
    SAPStatus?: boolean;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Extra1?: string;
    Extra2?: string;
    ApproverId?: number;
    IsApprovedByAll?: boolean;
    IsRejected?: boolean;
    RejectedBy?: number;
    RejectedDate?: Date;
    PRPendingBy?: string;
    IsApprovalStart?: boolean;
}


export interface PurchaseRequisitionDataVM{
    Id?:number;
    ERPPRNumber?:string;
    PRDocType:string;
    PRToRFQ?:boolean;
    PRDate?:Date;
    PRLineItem:PurchaseRequisitionLine[];
}

export interface PurchaseRequisitionLine{
    Id:number;
    LineId?:number;
    Product?:Products;
    ProductCode?:string;
    Description?:string;
    ProductGroup?:string;
    DeliveryDate?:Date;
    Plant?: Plants;
    Qty?: number;
    StorageLocation?: StorageLocations;
    Unit?: Units;
}

export interface PurchaseRequisitionDetailsVM{
    Id?:number;
    ERPPRNumber?:string;
    PRDocType:string;
    PRToRFQ?:boolean;
    PRDate?:Date;
    ApproverId?: number;
    IsApprovedByAll?: boolean;
    IsRejected?: boolean;
    RejectedBy?: number;
    RejectedDate?: Date;
    PRPendingBy?: string;
    IsApprovalStart?: boolean;
    PRLineItems:PurchaseRequisitionDetailsLine[];
}
export interface PurchaseRequisitionDetailsLine{
    Id?: number,
    PRHeaderId: number,
    ProductId?: number,
    ProductCode?: string,
    ProductDescription?: string,
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
