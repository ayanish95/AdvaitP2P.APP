import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
import { PurchaseOrderDetailsVM, PurchaseOrderHeader } from '@core/models/purchase-order';
import { ASNDetailsLine } from '../asn';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { AdvancedShipmentNotificationVM } from '@core/models/advance-shipping-notification';


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
    Documentdate: [new Date(), [Validators.required]],
    SupplierCode: [null, [Validators.required]],
    SupplierName: [null, [Validators.required]],
    Deliverydate: [new Date(), [Validators.required]],

  });

  BatchAndSerialNoForm = this.fb.group({
    items: new FormArray([]),
  });

  approvedPolist: PurchaseOrderHeader[] = [];
  filteredprno!: Observable<PurchaseOrderHeader[]>;

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

  PoDetails!: PurchaseOrderDetailsVM;

  //POLineItems: PurchaseOrderDetailsLine[] = [];
  ASNLineItems: ASNDetailsLine[] = [];
  dataSource = new MatTableDataSource<any>();
  index = 0;
  PRId!: number;
  displayedColumns: string[] = [
    'srNo',
    'polineno',
    'Sequanceno',
    'ProductCode',
    'Description',
    'Deliveryqty',
    'PutAwayqty',
    'Unit',
    'Plant',
    'Location',
    'Edit',
    'Delete',
  ];

  minDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!: number;
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private advanceShippingNotificationService: AdvanceShippingNotificationService,
    private toaster: ToastrService, private docTypeSerivce: DocTypeService, private purchaseOrderService: PurchaseOrderService,
    private router: Router, private route: ActivatedRoute, private authService: AuthService, private supplierService: SupplierService) {
    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
      // if (!this.PRId || this.PRId <= 0)
      //   this.router.navigateByUrl('/pages/purchase-requisition');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.ASNHeaderForm.get('Documentdate')?.disable();
    this.currentUserId = this.authService.userId();
    this.apiDocType();
    if (this.PRId)
      this.apiGetPoDetailsById(this.PRId);

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
          console.log(this.approvedPolist);
          this.filteredprno = this.ASNHeaderForm.get('PoNo')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPono(value || ''))
          );
        }
      });

  }

  filterPono(name: any) {
    if (name?.Id) {
      return this.approvedPolist.filter(po => po.ERPPONumber);
    }
    else {
      return this.approvedPolist.filter(po => po.ERPPONumber);
    }
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

  getpono(selectedPRNumber: number) {

    this.purchaseOrderService.getPODetailsById(selectedPRNumber).subscribe(response => {
      console.log(response);
      // this.ASNHeaderForm.reset();
      // this.ASNHeaderForm.updateValueAndValidity();

      this.PoDetails = response[ResultEnum.Model];
      if (this.PoDetails) {
        this.ASNHeaderForm.patchValue({
          PoNo: this.PoDetails.ERPPONumber as any,
          DocType: this.PoDetails.DocType as any,
          Documentdate: this.formatDate(this.PoDetails.PODate) as any,
          SupplierCode: this.PoDetails.SupplierCode as any,
          SupplierName: this.PoDetails.SupplierName as any,
        });
      }

      // Update the prData array with the received data
      this.dataSource.data = response.Model.POLineItems;
      this.ASNLineItems = response.Model.POLineItems;
    });
  }

  apiGetPoDetailsById(poId: number) {

    // this.ASNHeaderForm.reset();
    this.ASNHeaderForm.updateValueAndValidity();

    this.purchaseOrderService
      .getPODetailsById(poId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.PoDetails = res[ResultEnum.Model];
            if (this.PoDetails) {
              this.ASNHeaderForm.patchValue({
                PoNo: this.PoDetails.ERPPONumber as any,
                DocType: this.PoDetails.DocType as any,
                Documentdate: this.formatDate(this.PoDetails.PODate) as any,
                SupplierCode: this.PoDetails.SupplierCode as any,
                SupplierName: this.PoDetails.SupplierName as any,
              });
            }

            this.PoDetails.POLineItems?.forEach((item, index) => {
              this.ASNLineItems.push({
                ProductCode: item ? item?.ProductCode : '',
                ProductDescription: item ? item?.ProductDescription : '',
                LineId: 0,
                POHeaderId: 0,
                ProductId: 0,
                ProductGroup: '',
                Qty: item ? item?.Qty : 0,
                DeliveryDate: item.DeliveryDate,
                UnitId: item ? item?.UnitId : 0,
                UnitName: item ? item?.UnitName : '',
                UnitDescription: '',
                PlantId: item ? item?.POHeaderId : 0,
                PlantCode: '',
                PlantDescription: item ? item?.PlantDescription : '',
                StorageLocationId: 0,
                LocationCode: '',
                LocationDescription: item ? item?.LocationDescription : '',
                IsActive: false,
                CreatedBy: 0,
                CreatedOn: item.CreatedOn,
                UpdatedBy: 0,
                UpdatedOn: item.UpdatedOn,
                IsDeleted: true,
                DeletedOn: item.DeletedOn,
                Extra1: '',
                Extra2: ''
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

  async openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    while (this.BatchAndSerialNoForm.controls.items?.length !== 0) {
      this.BatchAndSerialNoForm.controls.items.removeAt(0)
    }
    if (data?.Qty) {
      for (let index = 0; index < data?.Qty; index++) {
        this.batchAndSerialNoGroupForm().push(this.fb.group({
          BatchNo: [],
          SerialNo: [],
        }));

      }
    }


    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  batchAndSerialNoGroupForm(): FormArray {
    return this.BatchAndSerialNoForm.get('items') as FormArray;
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
        if (element?.LineId) {
          this.purchaseOrderService.deletePOLineByLineId(element.LineId ? element.LineId : 0).subscribe({
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

  DetLineChange(paramevent: any, paramIndex: number) {
    debugger;
    const _letNumber = Number(paramevent.target.value);

    this.ASNLineItems[paramIndex].Qty = _letNumber;

    //this.dataSource.data[paramIndex].Qty = _letNumber;
    this.dataSource.data = this.ASNLineItems;
  }
  openForAddAsn() {
    debugger;
    if (this.ASNHeaderForm)
      console.log(this.ASNHeaderForm);
    this.advanceShippingNotificationService;
    if (this.ASNHeaderForm.valid) {
      const PRHeaderData = this.ASNHeaderForm.value as any;
      const ASNAdd: AdvancedShipmentNotificationVM = {
        ERPPONumber: PRHeaderData.ERPPONumber?.Id as any,
        DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        SupplierCode: PRHeaderData.SupplierCode?.SupplierCode as any,
        SupplierName: PRHeaderData.SupplierName as any,
        ASNDate: PRHeaderData.ASNDate ? PRHeaderData.ASNDate : new Date(),
        DeliveryDate: PRHeaderData.DeliveryDate ? PRHeaderData.DeliveryDate : new Date(),
        AsnDetVM: []
      };

      this.advanceShippingNotificationService.AddAsn(ASNAdd).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            console.log(res);

          }
          else {
            // this.toaster.error(res.Message);
          }
        },
        error: (e) => { },
        complete() {

        },
      });
    }
  }


}
