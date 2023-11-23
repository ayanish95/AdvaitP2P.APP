import { Plants } from './plants';
import { Products } from './products';
import { StorageLocations } from './storage-location';
import { Units } from './units';

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
