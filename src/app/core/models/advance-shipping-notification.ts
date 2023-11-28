
export interface AdvancedShipmentNotificationVM{
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
  ASNDetails:AdvancedShipmentNotificationDetVM[];  
}

export interface AdvancedShipmentNotificationDetVM{
  Id?: number,
  LineId?: number,
  POId: number,
  ASNHeaderId: number,
  PODetId: number,
  ProductCode: string,
  ProductDescription: string,
  ProductGroup: string,
  UnitName?:string;
  StockType: string,
  Plant: string,
  StorageLocation: string,
  TotalWeight?: number;
  QtyWeight?: number;
  TotalQty?: number;
  DeliveryQty?: number;
  DeliveryDate?: Date,
  OpenGRQty: number,
  Length?: number,
  Hight?: number,
  Width?: number,
  IsBatchNo?: boolean,
  IsSerialNo?: boolean,
  ASNProductDetails:AdvancedShipmentNotificationProductDet[];
}

export interface ASNDetailsLine{
  Id?: number,
  LineId : number,
  POHeaderId: number,
  POLineId: number,
  ProductId: number,
  ProductCode: string,
  ProductDescription: string,
  ProductGroup: string,
  POQty: number,
  Qty: number,
  OpenGRQty?: number,
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