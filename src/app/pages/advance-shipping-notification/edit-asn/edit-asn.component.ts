import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { StorageLocations } from '@core/models/storage-location';
import { Units } from '@core/models/units';
import { DocTypeService } from '@core/services/doc-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { SupplierService } from '@core/services/supplier.service';
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { AdvancedShipmentNotificationVM, AdvancedShipmentNotificationProductDet, ASNDetailsLine } from '@core/models/advance-shipping-notification';
import { CommonEnum } from '@core/enums/common-enum';
import { find } from 'rxjs/operators';

@Component({
  selector: 'app-edit-asn',
  templateUrl: './edit-asn.component.html',
  styleUrls: ['./edit-asn.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' }
    }
  ]
})
export class EditAsnComponent {
  ASNHeaderForm = this.fb.group({
    ASNNumber: [{value:null,disabled:true}],
    PoNo: [{value:null,disabled:true}, [Validators.required]],
    DocType: [{value:null,disabled:true}, [Validators.required]],
    Documentdate: [{value:Date(),disabled:true} , [Validators.required]],
    SupplierId: [null, [Validators.required]],
    SupplierCode: [{value:null,disabled:true}, [Validators.required]],
    SupplierName: [null],
    Shippingdate: [new Date(), [Validators.required]],
    Deliverydate: [new Date(), [Validators.required]],

  });

  BatchAndSerialNoForm = this.fb.group({
    items: new FormArray([]),
  });
  plantList!: Plants[];
  filteredPlants!: Observable<any>;

  unitList!: Units[];
  filteredUnits!: Observable<any>;

  productList!: Products[];
  filteredProducts!: Observable<Products[]>;
  locationList!: StorageLocations[];
  filteredlocation!: Observable<StorageLocations[]>;

  PoDetails!: PurchaseOrderVM;
  ASNDetails!: AdvancedShipmentNotificationVM;

  //POLineItems: PurchaseOrderDetailsLine[] = [];
  ASNLineItems: ASNDetailsLine[] = [];
  dataSource = new MatTableDataSource<any>();
  index = 0;
  POId!: number;
  ASNId!: number;
  displayedColumns: string[] = [
    'srNo',
    'polineno',
    // 'Sequanceno',
    'ProductCode',
    // 'Description',
    'Deliveryqty',
    'PutAwayqty',
    'Unit',
    // 'Plant',
    'Location',
    'Edit',
    'Delete',
  ];
  currentDate: Date = new Date();
  minShippingDate: Date = new Date();
  minDeliveryDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!: number;
  selecteItemQty!: number;
  selectePOLineId!: number;
  selectePOId!: number;
  deliveryQty!:number;
  batchAndSerialNoList: AdvancedShipmentNotificationProductDet[] = [];
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private advanceShippingNotificationService: AdvanceShippingNotificationService,
    private toaster: ToastrService, private docTypeSerivce: DocTypeService,
    private router: Router, private route: ActivatedRoute, private authService: AuthService, private supplierService: SupplierService) {
    this.route.queryParams.subscribe((params: any) => {
      this.ASNId = params.id;
      // if (!this.PRId || this.PRId <= 0)
      //   this.router.navigateByUrl('/pages/purchase-requisition');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.ASNHeaderForm.get('Documentdate')?.disable();
    this.currentUserId = this.authService.userId();
    if (this.ASNId)
      this.apiGetASNDetailsById(this.ASNId);
  }

  apiGetASNDetailsById(asnId: number) {
    // this.ASNHeaderForm.reset();
    this.ASNLineItems = [];
    this.dataSource.data = [];
    this.ASNHeaderForm.updateValueAndValidity();

    this.advanceShippingNotificationService
      .GetASNDetailsById(asnId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.ASNDetails = res[ResultEnum.Model];
            if (this.ASNDetails) {
              this.ASNHeaderForm.patchValue({
                ASNNumber: this.ASNDetails.ASNNo as any,
                PoNo: this.ASNDetails.ERPPONumber as any,
                DocType: this.ASNDetails.DocType as any,
                Documentdate: this.formatDate(this.ASNDetails.ASNDate) as any,
                SupplierId: this.ASNDetails?.SupplierId as any,
                 SupplierCode: this.ASNDetails?.Supplier?.SupplierCode + ' - '+this.ASNDetails?.Supplier?.FirstName +' '+ this.ASNDetails?.Supplier?.LastName as any,
                // SupplierName: this.ASNDetails?.SupplierName as any,
                Shippingdate: this.formatDate(this.ASNDetails?.ShippingDate) as any,
                Deliverydate: this.formatDate(this.ASNDetails?.DeliveryDate) as any,
              });
              
              const  shippingDate=new Date(this.ASNDetails?.ShippingDate ? this.ASNDetails?.ShippingDate : new Date());
              if (this.currentDate.getTime() > shippingDate.getTime())
                this.minShippingDate = new Date(shippingDate);
                if (this.currentDate.getTime() > new Date(this.ASNDetails?.DeliveryDate ? this.ASNDetails?.DeliveryDate : new Date()).getTime())
                this.minDeliveryDate = new Date(this.ASNDetails?.DeliveryDate ? this.ASNDetails?.DeliveryDate : new Date());
            }

            this.ASNDetails.ASNDetails?.forEach((item, index) => {
              this.ASNLineItems.push({
                Id: item ? item?.Id : 0,
                ProductId: item.ProductId,
                Product:item.Product,
                POId: item ? item?.POId : 0,
                PODetId: item?.Id ? item?.PODetId : 0,
                DeliveryQty: item ? item?.DeliveryQty : 0,
                OpenGRQty: item ? item?.OpenGRQty : 0,
                TotalQty: (item?.DeliveryQty ? item?.DeliveryQty : 0) +( item?.OpenGRQty ?item?.OpenGRQty : 0),
                DeliveryDate: item.DeliveryDate,
                UnitId : item.UnitId,
                Unit : item.Unit,
                StorageLocationId:item.StorageLocationId,
                StorageLocation : item.StorageLocation,
                // UnitName: item ? item?.UnitName : '',
                // Plant: item ? item?.Plant : '',
                // StorageLocation: item ? item?.StorageLocation : '',
                ASNHeaderId: item ? item?.ASNHeaderId : 0,
                StockType: item ? item?.StockType : '',
                IsBatchNo: item ? item?.IsBatchNo : false,
                IsSerialNo: item ? item?.IsSerialNo : false,
                ASNProductDetails: item ? item?.ASNProductDetails : [],
                POQty: 0
              });
            });

            this.dataSource.data = this.ASNLineItems;            
          }

          else
            this.toaster.error(res[ResultEnum.Message]);
        }

        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    this.selecteItemQty = 0;
    const isSerialNo = data?.IsSerialNo;
    const isBatchNo = data?.IsBatchNo;
    while (this.BatchAndSerialNoForm.controls.items?.length !== 0) {
      this.BatchAndSerialNoForm.controls.items.removeAt(0);
    }
    const type = this.checkProductType(isSerialNo, isBatchNo);
    if (data?.DeliveryQty) {
      this.selecteItemQty = data.DeliveryQty;
      this.selectePOLineId = data?.PODetId;
      this.selectePOId = data?.POId;
      if (!this.selectePOId || !this.selectePOLineId)
        throw this.toaster.error('PO Id or PO Line Id not found for selected row...');
      if (type != CommonEnum.None) {
          data?.ASNProductDetails?.forEach((element:any) => {
            this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(type, element));
          });
      }
    }

    this.dialog.open(templateRef, {
      width: type == CommonEnum.All ? '56vw' : '45vw',
      panelClass: 'custom-modalbox'
    });
  }

  createFormForBatchAndSerialNo(type: any,data:any) {
    if (type == CommonEnum.All) {
      return this.fb.group({
        Id: [data?.Id],
        PoId: [data?.POId],
        POLineId: [data?.PODetId],
        BatchNo: [data?.BatchNo],
        SerialNo: [data?.SerialNo],
      });
    }
    else if (type == CommonEnum.BatchNo) {
      return this.fb.group({
        Id: [data?.Id],
        PoId: [data?.POId],
        POLineId: [data?.PODetId],
        BatchNo: [data?.BatchNo],
        Qty: [data?.Qty]
      });
    }
    else if (type == CommonEnum.SerialNo) {
      return this.fb.group({
        Id: [data?.Id],
        PoId: [data?.POId],
        POLineId: [data?.PODetId],
        SerialNo: [data?.SerialNo],
      });
    }
    else return null;
  }

  addBatchNumberFormRow() {
    this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(CommonEnum.BatchNo, null));
  }

  removeBatchNumberFormRow(i: any) {
    const remove = this.BatchAndSerialNoForm.get('items') as FormArray;
    remove.removeAt(i);
  }

  checkProductType(isSerialNo: any, isBatchNo: any) {
    if (isBatchNo && !isSerialNo)
      return CommonEnum.BatchNo;
    else if (!isBatchNo && isSerialNo)
      return CommonEnum.SerialNo;
    else if (isBatchNo && isSerialNo)
      return CommonEnum.All;
    else if (!isBatchNo && !isSerialNo)
      return CommonEnum.None;
    return CommonEnum.None;
  }

  batchAndSerialNoGroupForm(): FormArray {
    return this.BatchAndSerialNoForm.get('items') as FormArray;
  }

  onClickAddBatchSerialNo() {
    debugger;
    this.batchAndSerialNoList = [];
    const batchSerialNo = this.BatchAndSerialNoForm.get('items')?.value;
    batchSerialNo?.forEach((data: any) => {
      this.batchAndSerialNoList.push({
        Id: data?.Id,
        PoId: data?.PoId,
        PoDetId: data?.POLineId,
        BatchNo: data?.BatchNo ? data?.BatchNo : '',
        Qty: data?.Qty ? data?.Qty : null,
        SerialNo: data?.SerialNo ? data?.SerialNo : '',
      });
    });
    
    // this.ASNLineItems.forEach( x =>{                      
    //   x.ASNProductDetails.forEach(y =>
    //     {
    //       if(y.Id == this.batchAndSerialNoList[0].Id){
    //         y.Qty = this.batchAndSerialNoList[0].Qty;
    //         y.BatchNo = this.batchAndSerialNoList[0].BatchNo;
    //         y.SerialNo = this.batchAndSerialNoList[0].SerialNo;
    //       }
    //     });    
    // });    
  }

  openModelForDeleteItem(templateRef: TemplateRef<any>, data?: any) {
    debugger;
    if (this.ASNLineItems?.length == 1)
      throw this.toaster.error('ASN must have one line item, you can not delete....');
    if (data?.LineId > 0) {
      this.dialog.open(templateRef);
      this.selectedLineId = data?.Id;
    }
    else {
      const id = data?.Id;
      this.ASNLineItems.forEach((element, index) => {
        element.Id = index + 1;
        if (element.Id == id) {
          this.ASNLineItems.splice(index, 1);
        }
      });
      this.ASNLineItems.forEach((element, index) => {
        element.Id = index + 1;
      });
      this.dataSource = new MatTableDataSource<any>(this.ASNLineItems);
    }
  }

  onClickDeleteItem() {
    const id = this.selectedLineId;
    this.ASNLineItems.forEach((element, index) => {
      element.Id = index + 1;
      if (element.Id == id) {
        if (element?.ASNLineId) {
          // this.purchaseOrderService.deletePOLineByLineId(element.LineId ? element.LineId : 0).subscribe({
          //   next: (res: any) => {
          //     if (res[ResultEnum.IsSuccess]) {
          //       this.toaster.success(res.Message);
          //     }
          //     else {
          //       this.toaster.error(res.Message);
          //     }
          //   },
          //   error: (e) => { this.toaster.error(e.Message); },
          //   complete() {
          //   },
          // });
        }
        this.dialog.closeAll();
        this.ASNLineItems.splice(index, 1);
      }
    });
    this.ASNLineItems.forEach((element, index) => {
      element.Id = index + 1;
    });
    this.dataSource = new MatTableDataSource<any>(this.ASNLineItems);
    this.selectedLineId = 0;
  }

  DetLineChange(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);

    //this.ASNLineItems[paramIndex].OpenGRQty = this.ASNLineItems[paramIndex].POQty;
    const totalQty=  this.ASNLineItems[paramIndex]?.TotalQty! ? this.ASNLineItems[paramIndex]?.TotalQty! : 0;
    this.ASNLineItems[paramIndex].OpenGRQty = totalQty - _letNumber;
    this.ASNLineItems[paramIndex].DeliveryQty = _letNumber;

    this.dataSource.data = this.ASNLineItems;
  }
  openForAddAsn() {
    // if(this.batchAndSerialNoList?.length == 0)

    const lineDet: ASNDetailsLine[] = [];
    this.ASNLineItems.forEach(element => {
      const asnLineDetails = this.batchAndSerialNoList.filter(x => x.PoDetId == element.ASNLineId);
      // lineDet.push({
      //   ASNHeaderId: 0,
      //   POId: element.POHeaderId,
      //   PODetId: element.POLineId ? element.POLineId : 0,
      //   ProductCode: element.ProductCode,
      //   Description: element.ProductDescription,
      //   ProductGroup: element.ProductGroup,
      //   StockType: element.StockType ? element.StockType : '',
      //   Plant: element.PlantCode,
      //   StorageLocation: element.LocationCode,
      //   OpenGRQty: element.OpenGRQty ? element.OpenGRQty : 0,
      //   DeliveryQty: element.Qty ? element.Qty : 0,
      //   DeliveryDate: element.DeliveryDate,
      //   ASNProductDetails: asnLineDetails
      // });
    });

    this.advanceShippingNotificationService;
    if (this.ASNHeaderForm.valid) {
      const PRHeaderData = this.ASNHeaderForm.value as any;
      const ASNAdd: AdvancedShipmentNotificationVM = {
        Id: this.ASNDetails.Id,
        POId: this.ASNDetails.POId,
        ERPPONumber: PRHeaderData.PoNo as any,
        DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        SupplierId: PRHeaderData?.SupplierId as any,
        DeliveryDate: PRHeaderData.DeliveryDate ? PRHeaderData.DeliveryDate : new Date(),
        ShippingDate: PRHeaderData.Shippingdate ? PRHeaderData.Shippingdate : new Date(),
        ASNDetails: this.ASNLineItems,

      };

      this.advanceShippingNotificationService.UpdateASNDetails(ASNAdd).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.ASNHeaderForm.reset();
            this.BatchAndSerialNoForm.reset();
            this.router.navigateByUrl('/pages/advance-shipping-notification');
          }
          else {
            this.toaster.error(res.Message);
          }
        },
        error: (e) => { },
        complete() {

        },
      });
    }
  }

}
