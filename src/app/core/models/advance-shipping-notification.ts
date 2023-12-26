import { Products } from "./products";
import { StorageLocations } from "./storage-location";
import { Units } from "./units";

export interface AdvancedShipmentNotificationVM{
  Id?:number;
  ASNId?:number;
  ERPPONumber:string;
  DocType:string;
  SupplierId?:number;
  PODate?:Date;
  CompanyCode?:string;
  CompanyName?:string;
  SupplierCode?:string;
  SupplierName?:string;
  SAPStatus?:boolean;
  ASNNo?:string;
  ASNDate?:Date;
  DeliveryDate?:Date;
  ShippingDate?:Date;
  POId?:number;
  TotalWeight?:number;
  SequenceNo?:number;
  Remark?:string;
  ASNCreatedBy?:string;
  ASNDetails:ASNDetailsLine[];  
}


export interface ASNDetailsLine{
  Id?: number,
  ASNHeaderId?: number,
  ASNLineId? : number,
  POId?: number,
  PODetId?: number,
  ProductId?: number,
  Product?:Products,
  POQty: number,
  //Qty?: number,
  OpenGRQty?: number,
  DeliveryDate?: Date,
  UnitId?: number,
  Unit?: Units,
  // UnitName?: string,
  // UnitDescription?: string,
  // PlantId?: number,
  // PlantCode?: string,
  // PlantDescription?: string,
  StorageLocationId?: number,
  StorageLocation?: StorageLocations,
  // LocationCode?: string,
  // LocationDescription?: string,
  TotalQty?: number;
  DeliveryQty?: number;

  NetPrice?:number;
  TotalNetPrice?:number;
  Currency?:string;
  HSNCode?:string;
  
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
  IsActive?: boolean,
  IsDeleted?: boolean,
  Width? : number,
  Height? : number,
  Length? : number,
  QtyWeight? : number,
  TotalWeight?: number;
  ASNProductDetails?:AdvancedShipmentNotificationProductDet[];
}

export class AdvancedShipmentNotificationProductDet{
  Id?:number;
  PoId?:number;
  PoDetId?:number;
  ASNHeaderId?:number;
  ASNDetId?:number;
  GRId?:number;
  QCId?:number;
  BatchNo?:string;
  Qty?:number;
  SerialNo?:string;
  SAPStatus?:boolean;
  IsInvoiceGenerated?:boolean;
  IsQualityChecked?:boolean;
  IsGRGenerated?:boolean;
}