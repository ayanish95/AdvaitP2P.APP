export interface GoodsReceivedNoteHeaderVM{
    Id?:number;
    GRNo?:string;
    ASNNo?:string;
    ASNId?:number;
    ERPPONumber?:string;
    DocType:string;
    SupplierId?:number;
    GRDeliveryDate?:Date;
    CompanyCode?:string;
    CompanyName?:string;
    SupplierCode?:string;
    SupplierName?:string;
    SAPStatus?:boolean;
    POId?:number;
    Remark?:string;
    GRNCreatedBy?:string;
    StockType?:string;
    Transaction?:string;
    GRNDetails:GoodsReceivedNoteDetVM[];  
  }

  export interface GoodsReceivedNoteDetVM{
    Id?: number,
    POId: number,
    ASNHeaderId: number,
    ASNDetId?: number,
    PODetId: number,
    // ProductCode: string,
    // ProductDescription: string,
    // ProductGroup: string,
    // UnitName?:string;
    StockType: string,
    // Plant: string,
    // StorageLocation: string,
    TotalWeight?: number;
    QtyWeight?: number;
    TotalQty?: number;
    GRDeliveryQty?: number;
    DeliveryDate?: Date,
    OpenGRQty: number,
    Length?: number,
    Hight?: number,
    Width?: number,
    IsBatchNo?: boolean,
    IsSerialNo?: boolean,
    IsSelected?: boolean,
    GRNProductDetails:GoodsReceivedNoteProductDet[];
  }

  export class GoodsReceivedNoteProductDet{
    Id?:number;
    GRNHeaderId?:number;
    GRNDetId?:number;
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
    IsSelected?: boolean;
  }