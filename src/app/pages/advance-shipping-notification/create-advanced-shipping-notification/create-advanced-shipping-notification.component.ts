import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
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
import { PlantService } from '@core/services/plant.service';
import { ProductService } from '@core/services/product.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { StorageLocationService } from '@core/services/storage-location.service';
import { UnitService } from '@core/services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { PurchaseOrderDetailsVM, PurchaseOrderHeader } from '@core/models/purchase-order';
import { ASNDetailsLine } from '../asn';


@Component({
  selector: 'app-create-advanced-shipping-notification',
  templateUrl: './create-advanced-shipping-notification.component.html',
  styleUrls: ['./create-advanced-shipping-notification.component.scss']
})
export class CreateAdvancedShippingNotificationComponent {
  PRHeaderForm = this.fb.group({
    pono: [null, [Validators.required]],
    DocType: [null, [Validators.required]],
    Documentdate: [new Date(), [Validators.required]],
    supplier: [null, [Validators.required]],
    spDescription: [null, [Validators.required]],
    Deliverydate: [new Date(), [Validators.required]],

  });

  PRLineForm = this.fb.group({
    Product: ['', [Validators.required]],
    Description: [''],
    ProductGroup: [''],
    Qty: ['', [Validators.required]],
    Unit: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    Plant: ['', [Validators.required]],
    StorageLocation: ['', [Validators.required]],
  });
  polist!: PurchaseOrderHeader[];
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
    'putawayqty',
    'Unit',
    'Plant',
    'Location',
    'Edit',
    'Delete',
  ];

  minDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!: number;
  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toast: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private prService: PurchaseRequistionService, private purchaseOrderService: PurchaseOrderService,
    private router: Router, private route: ActivatedRoute, private authService: AuthService, private supplierService: SupplierService) {
    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
      // if (!this.PRId || this.PRId <= 0)
      //   this.router.navigateByUrl('/pages/purchase-requisition');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.PRHeaderForm.get('Documentdate')?.disable();
    this.currentUserId = this.authService.userId();
    this.apiDocType();
    this.apiProductList();
    this.apiPlantList();
    this.apuUnitList();
    this.apiStorageLocationList();
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
          this.filtersupplierCode = this.PRHeaderForm.get('supplier')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterSupplier(value || ''))
          );
        }
      });
    this.prService
      .getAllPRHeaderList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.polist = res[ResultEnum.Model];

          this.filteredprno = this.PRHeaderForm.get('pono')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPono(value || ''))
          );
        }
      });


  }
  filterPono(name: any) {
    debugger
    if (name?.ERPPONumber) {
      return this.polist?.filter(Erppo => Erppo?.ERPPONumber);

    }
    else {
      return this.polist?.filter(Erppo => Erppo?.ERPPONumber);
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
  getsupplier(event: any) {

    const supplier = this.suppliercodelist.find(x => x.SupplierCode?.toLowerCase() == event?.SupplierCode?.toLowerCase());
    if (supplier) {
    }
  }
  getpono(selectedPRNumber: number) {
    this.prService.getPRDetailsById(selectedPRNumber).subscribe(response => {

      // Update the prData array with the received data
      this.dataSource = response.Model.PRLineItems;
    });
  }


  apiGetPoDetailsById(poId: number) {
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
              this.PRHeaderForm.patchValue({
                pono: this.PoDetails.ERPPONumber as any,
                DocType: this.PoDetails.DocType as any,
                Documentdate: this.formatDate(this.PoDetails.PODate) as any,
                supplier: this.PoDetails.SupplierCode as any,
                spDescription: this.PoDetails.SupplierName as any,
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
                Qty:  item ? item?.POHeaderId : 0,
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
            this.toast.error(res[ResultEnum.Message]);
        }

        else
          this.toast.error(res[ResultEnum.Message]);
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
          this.filteredDocType = this.PRHeaderForm.get('DocType')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterDocType(value || ''))
          );
        }
      });
  }

  async apiProductList() {
    await this.productService
      .getProductList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productList = res[ResultEnum.Model];
          this.productList.map(x => x.ProductFullName = x.ProductCode + (x.Description ? ' - ' + x.Description : ''));
          if (this.PRId)
            this.apiGetPoDetailsById(this.PRId);
          this.filteredProducts = this.PRLineForm.get('Product')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProducts(value || ''))
          );
        }
      });
  }
  apiPlantList() {
    this.plantService
      .getPlantList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
          this.filteredPlants = this.PRLineForm.get('Plant')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPlant(value || ''))
          );
        }
      });

  }


  apuUnitList() {
    this.unitService
      .getAllUnit()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.unitList = res[ResultEnum.Model];
          this.filteredUnits = this.PRLineForm.get('Unit')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUnit(value || ''))
          );
        }
      });
  }

  apiStorageLocationList() {
    this.storageLocationService.getAllLocationList().pipe(
      finalize(() => {
      })
    )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.locationList = res[ResultEnum.Model];

          this.filteredlocation = this.PRLineForm.get('StorageLocation')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStorageLocation(value || ''))
          );
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
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

  filterProducts(name: any) {
    if (name?.ProductCode) {
      return this.productList.filter(product => product?.ProductCode?.toLowerCase().includes(name.ProductCode.toLowerCase()));
    }
    else {
      return this.productList.filter(product => product?.ProductCode?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterUnit(name: any) {
    if (name?.UnitName || name?.MeasurementUnitName)
      return this.unitList.filter(unit => unit?.UOM?.toLowerCase().indexOf(name.UOM.toLowerCase()) === 0 ||
        unit?.MeasurementUnitName?.toLowerCase().indexOf(name.MeasurementUnitName.toLowerCase()) === 0);

    else
      return this.unitList.filter(plant => plant?.UnitName?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        plant?.MeasurementUnitName?.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterPlant(name: any) {
    if (name?.PlantCode || name?.PlantName)
      return this.plantList.filter(plant => plant?.PlantName?.toLowerCase().indexOf(name.PlantName.toLowerCase()) === 0 ||
        plant?.PlantCode?.toLowerCase().indexOf(name.PlantCode.toLowerCase()) === 0);

    else
      return this.plantList.filter(plant => plant?.PlantName?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        plant?.PlantCode?.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterStorageLocation(name: any) {
    if (name?.LocationCode || name?.LocationName) {
      return this.locationList.filter(location => location?.LocationCode?.toLowerCase().includes(name.LocationCode.toLowerCase()) ||
        location?.LocationName?.toLowerCase().includes(name.LocationName.toLowerCase()));
    }
    else {
      return this.locationList.filter(location => location?.LocationCode?.toLowerCase().includes(name.toLowerCase()) ||
        location?.LocationName?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  docTypeDisplayFn(docType: DocTypes) {
    return docType ? docType.Type! : '';
  }

  productDisplayFn(product: Products) {
    return product ? product.ProductCode! : '';
  }

  unitDisplayFn(units: Units) {
    return units ? units.UOM + ' - ' + units.MeasurementUnitName! : '';
  }

  plantDisplayFn(user: Plants) {
    return user ? user.PlantCode + ' - ' + user.PlantName! : '';
  }

  storageLocationDisplayFn(location: StorageLocations) {
    return location ? location.LocationCode + ' - ' + location.LocationName! : '';
  }


  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  getPosts(event: any) {
    const product = this.productList.find(x => x.ProductCode?.toLowerCase() == event?.ProductCode?.toLowerCase());
    if (product) {
      this.PRLineForm.get('Description')?.setValue(product?.Description ? product?.Description : null);
      this.PRLineForm.get('ProductGroup')?.setValue(product?.ProductGroup ? product?.ProductGroup : '');
    }
  }


  onChangePlant(event: any, IsEdit = false, locationId?: number) {
    this.locationList = [];
    this.PRLineForm.get('StorageLocation')?.setValue(null);
    if (event) {
      this.storageLocationService.getStorageLocationByPlantCode(event).pipe(
        finalize(() => {
        })
      )
        .subscribe(res => {
          if (res[ResultEnum.IsSuccess]) {
            this.locationList = res[ResultEnum.Model];
            if (IsEdit && this.locationList?.length > 0) {
              this.PRLineForm.get('StorageLocation')?.setValue(this.locationList.find(x => x.Id == locationId) as any);
            }

            this.filteredlocation = this.PRLineForm.get('StorageLocation')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterStorageLocation(value || ''))
            );
          }
          else {
            this.toast.error(res[ResultEnum.Message]);
          }
        });

    }
    else
      this.toast.error('Plant code not found');
  }

  async openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
    if (data) {
      this.selectedLineId = data?.Id;
      this.minDate = data.DeliveryDate;
      await this.onChangePlant(data?.Plant?.PlantCode, true, data?.StorageLocation?.Id);
      this.PRLineForm.patchValue({
        Product: this.productList?.find(x => x.ProductCode == data?.Product?.ProductCode) as any,
        Description: data?.Description,
        ProductGroup: data?.ProductGroup,
        Qty: data.Qty,
        Unit: this.unitList.find(x => x.Id == data?.Unit?.Id) as any,
        DeliveryDate: data.DeliveryDate,
        Plant: this.plantList?.find(x => x.Id == data?.Plant?.Id) as any,
        StorageLocation: this.locationList?.find(x => x.Id == data?.StorageLocation?.Id) as any
      });
    }
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }


  // onClickAddProduct() {
  //   const PRline = this.PRLineForm.value;
  //   if (this.selectedLineId > 0) {
  //     this.POLineItems.forEach(item => {
  //       if (item?.Id == this.selectedLineId) {
  //         item.Product = PRline.Product as unknown as Products,
  //           item.ProductGroup = PRline.ProductGroup ? PRline.ProductGroup : '',
  //           item.Description = PRline.Description ? PRline.Description : '',
  //           item.Qty = PRline?.Qty as unknown as number,
  //           item.DeliveryDate = PRline?.DeliveryDate as unknown as Date,
  //           item.Unit = PRline.Unit as unknown as Units,
  //           item.Plant = PRline.Plant as unknown as Plants,
  //           item.StorageLocation = PRline.StorageLocation as unknown as StorageLocations,
  //           item.LineId = item.LineId,
  //           item.Id = item.Id;
  //       }
  //     });
  //   }
  //   else {
  //     this.POLineItems.push({
  //       Product: PRline.Product as unknown as Products,
  //       ProductGroup: PRline.ProductGroup ? PRline.ProductGroup : '',
  //       Description: PRline.Description ? PRline.Description : '',
  //       Qty: PRline?.Qty as unknown as number,
  //       DeliveryDate: PRline?.DeliveryDate as unknown as Date,
  //       Unit: PRline.Unit as unknown as Units,
  //       Plant: PRline.Plant as unknown as Plants,
  //       StorageLocation: PRline.StorageLocation as unknown as StorageLocations,
  //       Id: this.POLineItems.length + 1,
  //       LineId: 0
  //     });
  //   }
  //   this.selectedLineId = 0;
  //   this.dataSource.data = this.POLineItems;
  // }
  openModelForDeleteItem(templateRef: TemplateRef<any>, data?: any) {
    if (this.ASNLineItems?.length == 1)
      throw this.toast.error('PR must have one line item, you can not delete....');
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
          this.prService.deletePRLineByLineId(element.LineId ? element.LineId : 0, this.currentUserId).subscribe({
            next: (res: any) => {
              if (res[ResultEnum.IsSuccess]) {
                this.toast.success(res.Message);
              }
              else {
                this.toast.error(res.Message);
              }
            },
            error: (e) => { this.toast.error(e.Message); },
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

}
