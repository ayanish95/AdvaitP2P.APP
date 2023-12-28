import { Company } from "./company";
import { Products } from "./products";
import { StorageLocations } from "./storage-location";
import { Suppliers } from "./suppliers";
import { Units } from "./units";

export interface AdvancedShipmentNotificationVM{
  Id?:number;
  ASNId?:number;
  ASNNo?:string;
  ASNDate?:Date;
  ERPPONumber:string;
  DocType:string;
  SupplierId?:number;
  Supplier?:Suppliers;
  PODate?:Date;
  CompanyCode?:string;
  // CompanyName?:string;
  Company?:Company;
  // SupplierCode?:string;
  // SupplierName?:string;
  SAPStatus?:boolean;
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
  StorageLocationId?: number,
  StorageLocation?: StorageLocations,
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
  SRNo?:number;
  Id?:number;
  POId?:number;
  PODetId?:number;
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
  IsDeleted?:boolean;
}