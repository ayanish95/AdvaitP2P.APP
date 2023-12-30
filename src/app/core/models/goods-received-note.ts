import { AdvancedShipmentNotificationVM } from "./advance-shipping-notification";
import { Company } from "./company";
import { Products } from "./products";
import { StorageLocations } from "./storage-location";
import { Suppliers } from "./suppliers";
import { Units } from "./units";

export interface GoodsReceivedNoteHeaderVM{
    Id?:number;
    GRNo?:string;
    ASNNo?:string;
    ASN?:AdvancedShipmentNotificationVM;
    ASNId?:number;
    ERPPONumber?:string;
    DocType:string;
    SupplierId?:number;
    GRDeliveryDate?:Date;
    CompanyCode?:string;
    Company?:Company;
    Supplier?:Suppliers;
    // SupplierName?:string;
    SAPStatus?:boolean;
    POId?:number;
    Remark?:string;
    GRNCreatedBy?:string;
    StockType?:string;
    Transaction?:string;
    IsGRGenerated?:boolean;
    GRNDetails:GoodsReceivedNoteDetVM[];  
  }

  export interface GoodsReceivedNoteDetVM{
    SRNo?: number,
    Id?: number,
    POId: number,
    ASNHeaderId: number,
    ASNDetId?: number,
    PODetId: number,
    ProductId?:number,
    Product?:Products,
    // ProductCode: string,
    // ProductDescription: string,
    // ProductGroup: string,
    // UnitName?:string;
    UnitId?:number,
    Unit?:Units,
    StockType?: string,
    // Plant: string,
    StorageLocationId?: number,
    StorageLocation?: StorageLocations,
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
    IsGRGenerated?: boolean,
    GRNProductDetails?:GoodsReceivedNoteProductDet[];
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