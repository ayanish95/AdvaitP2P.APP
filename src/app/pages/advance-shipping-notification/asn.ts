
export interface ASNDetailsLine{
  Id?: number,
  LineId : number,
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
