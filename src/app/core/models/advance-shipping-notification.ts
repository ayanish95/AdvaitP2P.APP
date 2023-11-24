
export interface AdvancedShipmentNotificationVM{
  ASNId?:number;
    ERPPONumber:string;
    DocType:string;
    SupplierId?:number;
    SupplierCode?:string;
    SupplierName?:string;
    PODate?:Date;
    CompanyCode?:string;
    CompanyName?:string;
    SAPStatus?:boolean;
    ASNNo?:string;
    ASNDate?:Date;
    DeliveryDate?:Date;
    POId?:number;
    TotalWeight?:number;
    SequenceNo?:number;
    Remark?:string;
    ASNCreatedBy?:string;
    AsnDetVM:AdvancedShipmentNotificationDetVM[];

}
export interface AdvancedShipmentNotificationDetVM{
  LineId?: number,
  POId: number,
  ASNHeaderId: number,
  PODetId: number,
  ProductCode: string,
  Description: string,
  ProductGroup: string,
  StockType: string,
  Plant: string,
  StorageLocation: string,
  TotalWeight?: number;
  QtyWeight?: number;
  DeliveryQty?: number;
  OpenGRQty: number,
  DeliveryDate: Date,
}

export class BatchAndSerialNumber{
  Id?:number;
  POLineId?:number;
  Qty?:number;
  BatchNo?:string;
  SerialNo?:string;
}

export interface ASNDetailsLine{
  Id?: number,
  LineId : number,
  POHeaderId: number,
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