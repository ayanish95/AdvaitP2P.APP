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
import { Location } from '@angular/common';

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
    ASNNumber: [{ value: null, disabled: true }],
    PoNo: [{ value: null, disabled: true }, [Validators.required]],
    DocType: [{ value: null, disabled: true }, [Validators.required]],
    Documentdate: [{ value: Date(), disabled: true }, [Validators.required]],
    SupplierId: [null, [Validators.required]],
    SupplierCode: [{ value: null, disabled: true }, [Validators.required]],
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
  deliveryQty!: number;
  batchAndSerialNoList: AdvancedShipmentNotificationProductDet[] = [];
  previousBatchSerialNo!: AdvancedShipmentNotificationProductDet;
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private advanceShippingNotificationService: AdvanceShippingNotificationService,
    private toaster: ToastrService, private docTypeSerivce: DocTypeService, private location: Location,
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
                SupplierCode: this.ASNDetails?.Supplier?.SupplierCode + ' - ' + this.ASNDetails?.Supplier?.FirstName + ' ' + this.ASNDetails?.Supplier?.LastName as any,
                // SupplierName: this.ASNDetails?.SupplierName as any,
                Shippingdate: this.formatDate(this.ASNDetails?.ShippingDate) as any,
                Deliverydate: this.formatDate(this.ASNDetails?.DeliveryDate) as any,
              });

              const shippingDate = new Date(this.ASNDetails?.ShippingDate ? this.ASNDetails?.ShippingDate : new Date());
              if (this.currentDate.getTime() > shippingDate.getTime())
                this.minShippingDate = new Date(shippingDate);
              if (this.currentDate.getTime() > new Date(this.ASNDetails?.DeliveryDate ? this.ASNDetails?.DeliveryDate : new Date()).getTime())
                this.minDeliveryDate = new Date(this.ASNDetails?.DeliveryDate ? this.ASNDetails?.DeliveryDate : new Date());
            }

            this.ASNDetails.ASNDetails?.forEach((item, index) => {
              item.ASNProductDetails = this.setASNProductDetails(item.ASNProductDetails) as any;
              this.ASNLineItems.push({
                Id: item ? item?.Id : 0,
                ProductId: item.ProductId,
                Product: item.Product,
                POId: item ? item?.POId : 0,
                PODetId: item?.Id ? item?.PODetId : 0,
                DeliveryQty: item ? item?.DeliveryQty : 0,
                OpenGRQty: item ? item?.OpenGRQty : 0,
                TotalQty: (item?.DeliveryQty ? item?.DeliveryQty : 0) + (item?.OpenGRQty ? item?.OpenGRQty : 0),
                DeliveryDate: item.DeliveryDate,
                UnitId: item.UnitId,
                Unit: item.Unit,
                StorageLocationId: item.StorageLocationId,
                StorageLocation: item.StorageLocation,
                // UnitName: item ? item?.UnitName : '',
                // Plant: item ? item?.Plant : '',
                // StorageLocation: item ? item?.StorageLocation : '',
                ASNHeaderId: item ? item?.ASNHeaderId : 0,
                StockType: item ? item?.StockType : '',
                IsBatchNo: item ? item?.IsBatchNo : false,
                IsSerialNo: item ? item?.IsSerialNo : false,
                IsDeleted: false,
                ASNProductDetails: item ? item.ASNProductDetails : [],
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

  setASNProductDetails(ASNProductDetails?: AdvancedShipmentNotificationProductDet[]) {
    if (ASNProductDetails && ASNProductDetails.length > 0) {
      ASNProductDetails.forEach((element, index) => {
        element.SRNo = index + 1;
        element.IsDeleted = false;
        this.batchAndSerialNoList.push(element);
      });
      return ASNProductDetails;
    }
    return [];
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
        let existingData = this.batchAndSerialNoList.filter(x => x.POId == this.selectePOId && x.PODetId == this.selectePOLineId && x.IsDeleted == false);
        if (existingData && existingData.length > 0) {
          existingData?.forEach((element: any) => {
            this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(type, element));
          });
        }
        else {
          for (let index = 0; index < data?.DeliveryQty; index++) {
            let BSData = { 'SRNo': index + 1, 'type': type, 'Id': 0, 'POId': this.selectePOId, 'PODetId': this.selectePOLineId, 'BatchNo': '', 'SerialNo': '', 'Qty': 1 };
            this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(type, BSData));
          }
        }

      }
    }

    this.dialog.open(templateRef, {
      width: type == CommonEnum.All ? '56vw' : '45vw',
      panelClass: 'custom-modalbox'
    });
  }

  createFormForBatchAndSerialNo(type: any, data: any) {
    if (type == CommonEnum.All) {
      return this.fb.group({
        SRNo: [data?.SRNo],
        Id: [data?.Id],
        PoId: [data?.POId],
        POLineId: [data?.PODetId],
        BatchNo: [data?.BatchNo],
        SerialNo: [data?.SerialNo],
      });
    }
    else if (type == CommonEnum.BatchNo) {
      return this.fb.group({
        SRNo: [data?.SRNo],
        Id: [data?.Id],
        PoId: [data?.POId],
        POLineId: [data?.PODetId],
        BatchNo: [data?.BatchNo],
        Qty: [data?.Qty]
      });
    }
    else if (type == CommonEnum.SerialNo) {
      return this.fb.group({
        SRNo: [data?.SRNo],
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
    if (remove.value) {
      let index = this.batchAndSerialNoList.findIndex(x => x.SRNo == remove.value[i]?.SRNo && x.POId == remove.value[i]?.PoId && x.PODetId == remove.value[i]?.POLineId);
      if (index != -1) {
        this.batchAndSerialNoList[index].IsDeleted = true;
      }
      this.previousBatchSerialNo = remove.value;
      remove.removeAt(i);
    }
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
    // this.batchAndSerialNoList = [];
    const batchSerialNo = this.BatchAndSerialNoForm.get('items')?.value;
    batchSerialNo?.forEach((data: any) => {
      let index = this.batchAndSerialNoList.findIndex(x => x.SRNo == data?.SRNo && x.POId == data?.PoId && x.PODetId == data?.POLineId && x.IsDeleted == false);
      if (index !== -1) {
        this.batchAndSerialNoList[index].BatchNo = data?.BatchNo ? data?.BatchNo : '';
        this.batchAndSerialNoList[index].Qty = data?.Qty ? data?.Qty : '';
        this.batchAndSerialNoList[index].SerialNo = data?.SerialNo ? data?.SerialNo : '';
      } else {
        this.batchAndSerialNoList.push({
          SRNo: data?.SRNo,
          Id: data?.Id,
          POId: data?.PoId,
          PODetId: data?.POLineId,
          BatchNo: data?.BatchNo ? data?.BatchNo : '',
          Qty: data?.Qty ? data?.Qty : 1,
          SerialNo: data?.SerialNo ? data?.SerialNo : '',
          IsDeleted: false
        });
      }
    });
    this.previousBatchSerialNo = new AdvancedShipmentNotificationProductDet();

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
    if (this.ASNLineItems?.length == 1)
      throw this.toaster.error('ASN must have one line item, you can not delete....');
    if (data?.Id > 0) {
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
    // this.ASNLineItems.forEach((element, index) => {
    //   element.Id = index + 1;
    //   if (element.Id == id) {
    //     if (element?.ASNLineId) {
    //       // this.purchaseOrderService.deletePOLineByLineId(element.LineId ? element.LineId : 0).subscribe({
    //       //   next: (res: any) => {
    //       //     if (res[ResultEnum.IsSuccess]) {
    //       //       this.toaster.success(res.Message);
    //       //     }
    //       //     else {
    //       //       this.toaster.error(res.Message);
    //       //     }
    //       //   },
    //       //   error: (e) => { this.toaster.error(e.Message); },
    //       //   complete() {
    //       //   },
    //       // });
    //     }
    //     this.dialog.closeAll();
    //     // this.ASNLineItems.splice(index, 1);
    //     this.ASNLineItems[index].IsDeleted = true;
    //   }
    // });
    let index = this.ASNLineItems.findIndex(x => x.Id == this.selectedLineId);
    if (index != -1)
      this.ASNLineItems[index].IsDeleted = true;
    this.dataSource = new MatTableDataSource<any>(this.ASNLineItems.filter(x => x.IsDeleted == false));
    this.selectedLineId = 0;
    this.dialog.closeAll();
  }

  DetLineChange(paramevent: any, paramIndex: number, data?: any) {
    const _letNumber = Number(paramevent.target.value);
    //this.ASNLineItems[paramIndex].OpenGRQty = this.ASNLineItems[paramIndex].POQty;
    const totalQty = this.ASNLineItems[paramIndex]?.TotalQty! ? this.ASNLineItems[paramIndex]?.TotalQty! : 0;
    this.ASNLineItems[paramIndex].OpenGRQty = totalQty - _letNumber;
    this.ASNLineItems[paramIndex].DeliveryQty = _letNumber;
    this.dataSource.data = this.ASNLineItems;
    this.batchAndSerialNoList.forEach(element => {
      if (element.PODetId == data.PODetId)
        element.IsDeleted = true;
      return element;
    });
  }
  openForAddAsn() {
    // if(this.batchAndSerialNoList?.length == 0)
    this.ASNLineItems.forEach(element => {
      // if (!element?.ASNProductDetails)
        element.ASNProductDetails = [];
      const asnLineDetails = this.batchAndSerialNoList?.filter(x => x.PODetId == element.PODetId);
      asnLineDetails?.forEach(productDetials => {
        if (productDetials)
          element?.ASNProductDetails?.push(productDetials);
      });

    });

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
        error: (e) => { this.toaster.error(e.Message) },
        complete() {

        },
      });
    }
  }

  onClickBack() {
    this.location.back();
  }

}
