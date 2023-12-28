import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { StorageLocations } from '@core/models/storage-location';
import { Units } from '@core/models/units';
import { DocTypeService } from '@core/services/doc-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { ASNDetailsLine, AdvancedShipmentNotificationVM, AdvancedShipmentNotificationProductDet } from '@core/models/advance-shipping-notification';
import { CommonEnum } from '@core/enums/common-enum';
import { Location } from '@angular/common';



@Component({
  selector: 'app-create-advanced-shipping-notification',
  templateUrl: './create-advanced-shipping-notification.component.html',
  styleUrls: ['./create-advanced-shipping-notification.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' }
    }
  ]
})
export class CreateAdvancedShippingNotificationComponent {
  ASNHeaderForm = this.fb.group({
    PoNo: [null, [Validators.required]],
    DocType: [null, [Validators.required]],
    ASNDate: [new Date(), [Validators.required]],
    SupplierId: [null, [Validators.required]],
    SupplierCode: [null, [Validators.required]],
    // SupplierName: [null, [Validators.required]],
    Shippingdate: [new Date(), [Validators.required]],
    Deliverydate: [new Date(), [Validators.required]],

  });

  BatchAndSerialNoForm = this.fb.group({
    items: new FormArray([]),
  });

  approvedPolist: PurchaseOrderVM[] = [];
  filteredprno!: Observable<PurchaseOrderVM[]>;

  suppliercodelist!: Suppliers[];
  filtersupplierCode!: Observable<Suppliers[]>;

  plantList!: Plants[];
  filteredPlants!: Observable<any>;

  unitList!: Units[];
  filteredUnits!: Observable<any>;

  docTypeList!: DocTypes[];
  filteredDocType!: Observable<DocTypes[]>;
  productList!: Products[];
  filteredProducts!: Observable<Products[]>;
  locationList!: StorageLocations[];
  filteredlocation!: Observable<StorageLocations[]>;

  PoDetails!: PurchaseOrderVM;

  //POLineItems: PurchaseOrderDetailsLine[] = [];
  ASNLineItems: ASNDetailsLine[] = [];
  dataSource = new MatTableDataSource<any>();
  index = 0;
  POId!: number;
  displayedColumns: string[] = [
    'srNo',
    'polineno',
    // 'Sequanceno',
    'ProductCode',
    'Description',
    'Deliveryqty',
    'Weight',
    'Length',
    'Width',
    'Height',
    'PutAwayqty',
    'Unit',
    // 'Plant',
    'Location',
    'Edit',
    'Delete',
  ];

  minDate: Date = new Date();
  deliveryMinDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!: number;
  selecteItemQty!: number;
  selectePOLineId!: number;
  selectePOId!: number;
  batchAndSerialNoList: AdvancedShipmentNotificationProductDet[] = [];

  poNumberControl = new FormControl();

  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private advanceShippingNotificationService: AdvanceShippingNotificationService,
    private toaster: ToastrService, private docTypeSerivce: DocTypeService, private purchaseOrderService: PurchaseOrderService,
    private router: Router, private route: ActivatedRoute, private authService: AuthService, private supplierService: SupplierService, private location: Location) {
    this.route.queryParams.subscribe((params: any) => {
      this.POId = params.id;
      // if (!this.PRId || this.PRId <= 0)
      //   this.router.navigateByUrl('/pages/purchase-requisition');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.ASNHeaderForm.get('ASNDate')?.disable();
    this.currentUserId = this.authService.userId();
    this.apiDocType();
    if (this.POId)
      this.apiGetPoDetailsById(this.POId);

    this.supplierService
      .getSupplierList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.suppliercodelist = res[ResultEnum.Model];
          this.suppliercodelist.map(x => x.ShortName = x.SupplierCode + (x.FirstName ? ' - ' + x.FirstName : ''));
          this.filtersupplierCode = this.ASNHeaderForm.get('SupplierCode')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterSupplier(value || ''))
          );
        }
      });

    this.purchaseOrderService
      .getAllApprovedPOHeaderListByUserId()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approvedPolist = res[ResultEnum.Model];
          this.filteredprno = this.poNumberControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPono(value || ''))
          );
        }
      });

  }

  filterPono(name: any) {
    return this.approvedPolist?.filter(po => po.ERPPONumber?.includes(name));
  }

  filterSupplier(name: any) {
    if (name?.supplierCode) {
      return this.suppliercodelist.filter(Supplier => Supplier?.SupplierCode);
    }
    else {
      return this.suppliercodelist.filter(Supplier => Supplier?.SupplierCode);
    }
  }

  supplierDisplayFn(supplier: Suppliers) {
    return supplier ? supplier.SupplierCode! : '';
  }

  suppliercodee(supplierCode: Suppliers) {
    return supplierCode ? supplierCode.SupplierCode! : ''; ``;
  }

  getpono(selectedPO: any) {

    this.POId = selectedPO?.Id;
    if (this.POId)
      this.apiGetPoDetailsById(this.POId);
    else
      throw this.toaster.error('Something went wrong, please try again.')
  }

  apiGetPoDetailsById(poId: number) {
    // this.ASNHeaderForm.reset();
    this.ASNLineItems = [];
    this.dataSource.data = [];
    this.ASNHeaderForm.updateValueAndValidity();

    this.purchaseOrderService
      .getPODetailsForASNById(poId).subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.PoDetails = res[ResultEnum.Model];
            if (this.PoDetails) {
              this.ASNHeaderForm.patchValue({
                // PoNo: this.PoDetails.ERPPONumber as any,
                DocType: this.PoDetails.DocType as any,
                ASNDate: this.formatDate(this.PoDetails.PODate) as any,
                SupplierId: this.PoDetails.SupplierId as any,
                SupplierCode: this.PoDetails.Supplier?.SupplierCode + ' - ' + this.PoDetails.Supplier?.FirstName + ' ' + this.PoDetails.Supplier?.LastName as any,
                // SupplierName: this.PoDetails.SupplierName as any,
              });
            }

            this.PoDetails.POLineItems?.forEach((item, index) => {
              this.ASNLineItems.push({
                POId: item ? item?.POHeaderId : 0,
                PODetId: item?.Id ? item?.Id : 0,
                POQty: item ? item?.OpenGRQty : 0 as any,
                DeliveryQty: item ? item?.OpenGRQty : 0,
                OpenGRQty: 0,
                DeliveryDate: item.DeliveryDate,
                ProductId: item ? item?.ProductId : 0,
                Product: item?.Product,
                UnitId: item ? item?.UnitId : 0,
                Unit: item?.Unit,
                StorageLocationId: item ? item?.StorageLocationId : 0,
                StorageLocation: item?.StorageLocation,
                IsActive: false,
                IsReturnItem: item?.IsReturnItem,
                IsGRGenerated: item?.IsGRGenerated,
                IsASNGenerated: item?.IsASNGenerated,
                IsInvoiceGenerated: item?.IsInvoiceGenerated,
                IsQualityChecked: item?.IsQualityChecked,
                IsSerialNo: item?.IsSerialNo,
                IsBatchNo: item?.IsBatchNo,
                QtyWeight: 0,
                Length: 0,
                Width: 0,
                Height: 0,
                ASNLineId: 0,
                Id: this.ASNLineItems.length + 1
              });
            });

            this.dataSource.data = this.ASNLineItems;
            // this.dataSource.data = this.PRDetails.PRLineItems;
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

  apiDocType() {
    this.docTypeSerivce
      .getAllDocType()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.docTypeList = res[ResultEnum.Model];
          this.filteredDocType = this.ASNHeaderForm.get('DocType')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterDocType(value || ''))
          );
        }
      });
  }
  // all dropdown search filters
  filterDocType(name: any) {
    if (name?.Type) {
      return this.docTypeList.filter(doctype => doctype?.Type?.toLowerCase().includes(name.Type.toLowerCase()));
    }
    else {
      return this.docTypeList.filter(doctype => doctype?.Type?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  docTypeDisplayFn(docType: DocTypes) {
    return docType ? docType.Type! : '';
  }

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  shippingDateChange(date: any) {
    this.deliveryMinDate = date;
    if (this.ASNHeaderForm.get('Deliverydate')?.value) {
      let deliverydate = new Date(this.ASNHeaderForm.get('Deliverydate')?.value as any) as Date;
      if (this.deliveryMinDate.getTime() > deliverydate.getTime())
        this.ASNHeaderForm.get('Deliverydate')?.setValue(null);
    }
  }

  async openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
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
      this.batchAndSerialNoList.map(x => x.IsDeleted = false);
      let existingData = this.batchAndSerialNoList?.filter(x => x.POId == this.selectePOId && x.PODetId == this.selectePOLineId);

      if (existingData?.length == 0) {
        if (type != CommonEnum.None) {
          if (type == CommonEnum.BatchNo) {
            let BSData = { 'SRNo': 1, 'type': type, 'POId': this.selectePOId, 'POLineId': this.selectePOLineId, 'BatchNo': '', 'SerialNo': '', 'Qty': null};
            this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(BSData));
          }
          else {
            for (let index = 0; index < data?.DeliveryQty; index++) {
              let BSData = { 'SRNo': index + 1, 'type': type, 'POId': this.selectePOId, 'POLineId': this.selectePOLineId, 'BatchNo': '', 'SerialNo': '', 'Qty': 1 };
              this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(BSData));
            }
          }
        }
      } else {
        if (type != CommonEnum.None) {
          existingData.forEach((element, index) => {
            let BSData = { 'SRNo': index + 1, 'type': type, 'POId': element?.POId, 'POLineId': element?.PODetId, 'BatchNo': element?.BatchNo, 'SerialNo': element?.SerialNo, 'Qty': element?.Qty };
            this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(BSData));
          });
        }
      }
    }

    this.dialog.open(templateRef, {
      width: type == CommonEnum.All ? '56vw' : '45vw',
      panelClass: 'custom-modalbox'
    });
  }

  createFormForBatchAndSerialNo(data: any) {
    if (data?.type == CommonEnum.All) {
      return this.fb.group({
        SRNo: [data?.SRNo],
        PoId: [data?.POId],
        POLineId: [data?.POLineId],
        BatchNo: [data?.BatchNo],
        SerialNo: [data?.SerialNo],
      });
    }
    else if (data?.type == CommonEnum.BatchNo) {
      return this.fb.group({
        SRNo: [data?.SRNo],
        PoId: [data?.POId],
        POLineId: [data?.POLineId],
        BatchNo: [data?.BatchNo],
        Qty: [data?.Qty]
      });
    }
    else if (data?.type == CommonEnum.SerialNo) {
      return this.fb.group({
        SRNo: [data?.SRNo],
        PoId: [data?.POId],
        POLineId: [data?.POLineId],
        SerialNo: [data?.SerialNo],
      });
    }
    else return null;
  }

  // createFormForBatchAndSerialNo1(type: any, PoId: number, lineId: number) {
  //   if (type == CommonEnum.All) {
  //     return this.fb.group({
  //       PoId: [PoId],
  //       POLineId: [lineId],
  //       BatchNo: [],
  //       SerialNo: [],
  //     });
  //   }
  //   else if (type == CommonEnum.BatchNo) {
  //     return this.fb.group({
  //       PoId: [PoId],
  //       POLineId: [lineId],
  //       BatchNo: [],
  //       Qty: []
  //     });
  //   }
  //   else if (type == CommonEnum.SerialNo) {
  //     return this.fb.group({
  //       PoId: [PoId],
  //       POLineId: [lineId],
  //       SerialNo: []
  //     });
  //   }
  //   else return null;
  // }

  addBatchNumberFormRow() {

    let BSData = { 'SRNo': this.BatchAndSerialNoForm.controls.items?.length + 1, 'type': CommonEnum.BatchNo, 'POId': this.selectePOId, 'POLineId': this.selectePOLineId, 'BatchNo': '', 'SerialNo': '', 'Qty': null };
    this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(BSData));
  }

  removeBatchNumberFormRow(i: any) {
    const remove = this.BatchAndSerialNoForm.get('items') as FormArray;
    if (remove.value) {
      let index = this.batchAndSerialNoList.findIndex(x => x.SRNo == remove.value[i]?.SRNo && x.POId == remove.value[i]?.PoId && x.PODetId == remove.value[i]?.POLineId);
      if (index != -1) {
        this.batchAndSerialNoList[index].IsDeleted = true;
      }
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
    const batchSerialNo = this.BatchAndSerialNoForm.get('items')?.value as any;
    this.batchAndSerialNoList = this.batchAndSerialNoList.filter(x => x.IsDeleted == false);
    batchSerialNo?.forEach((data: any) => {
      let index = this.batchAndSerialNoList.findIndex(x => x.SRNo == data?.SRNo && x.POId == data?.PoId && x.PODetId == data?.POLineId);
      if (index !== -1) {
        this.batchAndSerialNoList[index].BatchNo = data?.BatchNo ? data?.BatchNo : '';
        this.batchAndSerialNoList[index].Qty = data?.Qty ? data?.Qty : '';
        this.batchAndSerialNoList[index].SerialNo = data?.SerialNo ? data?.SerialNo : '';
      }
      else {
        this.batchAndSerialNoList.push({
          SRNo: data?.SRNo,
          Id: 0,
          POId: data?.PoId,
          PODetId: data?.POLineId,
          BatchNo: data?.BatchNo ? data?.BatchNo : '',
          Qty: data?.Qty ? data?.Qty : 1,
          SerialNo: data?.SerialNo ? data?.SerialNo : '',
          IsDeleted: false
        });
      }
    });

  }

  openModelForDeleteItem(templateRef: TemplateRef<any>, data?: any) {
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
          this.purchaseOrderService.deletePOLineByLineId(element.ASNLineId ? element.ASNLineId : 0).subscribe({
            next: (res: any) => {
              if (res[ResultEnum.IsSuccess]) {
                this.toaster.success(res.Message);
              }
              else {
                this.toaster.error(res.Message);
              }
            },
            error: (e) => { this.toaster.error(e.Message); },
            complete() {
            },
          });
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

  DetLineChange(paramevent: any, paramIndex: number, data?: any) {
    const _letNumber = Number(paramevent.target.value);
    this.ASNLineItems[paramIndex].OpenGRQty = this.ASNLineItems[paramIndex].POQty - _letNumber;
    this.ASNLineItems[paramIndex].DeliveryQty = _letNumber;
    this.dataSource.data = this.ASNLineItems;
    this.batchAndSerialNoList = this.batchAndSerialNoList?.filter(x => x.PODetId != data?.PODetId)
  }
  DetLineChangeQtyWeight(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    this.ASNLineItems[paramIndex].QtyWeight = _letNumber;
    this.dataSource.data = this.ASNLineItems;
  }
  DetLineChangeLength(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    this.ASNLineItems[paramIndex].Length = _letNumber;
    this.dataSource.data = this.ASNLineItems;
  }
  DetLineChangeWidth(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    this.ASNLineItems[paramIndex].Width = _letNumber;
    this.dataSource.data = this.ASNLineItems;
  }
  DetLineChangeHeight(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    this.ASNLineItems[paramIndex].Height = _letNumber;
    this.dataSource.data = this.ASNLineItems;
  }
  openForAddAsn() {
    this.ASNHeaderForm.markAllAsTouched();
    if (!this.ASNHeaderForm.valid)
      return;
    // if(this.batchAndSerialNoList?.length == 0)
    //  const lineDet: AdvancedShipmentNotificationDetVM[] = [];
    this.ASNLineItems.forEach(element => {
      const asnLineDetails = this.batchAndSerialNoList?.filter(x => x.PODetId == element.PODetId);
      element.ASNProductDetails = asnLineDetails;
    });

    this.advanceShippingNotificationService;
    const PRHeaderData = this.ASNHeaderForm.value as any;
    const ASNAdd: AdvancedShipmentNotificationVM = {
      POId: PRHeaderData.PoNo?.Id,
      ERPPONumber: PRHeaderData.PoNo?.ERPPONumber as any,
      DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
      SupplierId: PRHeaderData?.SupplierId as any,
      DeliveryDate: PRHeaderData.DeliveryDate ? PRHeaderData.DeliveryDate : new Date(),
      ShippingDate: PRHeaderData.Shippingdate ? PRHeaderData.Shippingdate : new Date(),
      ASNDate: PRHeaderData.ASNDate ? PRHeaderData.ASNDate : new Date(),
      ASNDetails: this.ASNLineItems,

    };

    this.advanceShippingNotificationService.AddAsn(ASNAdd).subscribe({
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
  onClickBack() {
    this.location.back();
  }



}
