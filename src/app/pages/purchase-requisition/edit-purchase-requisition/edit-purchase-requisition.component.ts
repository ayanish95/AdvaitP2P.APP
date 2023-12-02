import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { PurchaseRequisitionDataVM, PurchaseRequisitionDetailsVM, PurchaseRequisitionLine } from '@core/models/purchase-requistion';
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
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-purchase-requisition',
  templateUrl: './edit-purchase-requisition.component.html',
  styleUrls: ['./edit-purchase-requisition.component.scss']
})
export class EditPurchaseRequisitionComponent implements OnInit {

  PRHeaderForm = this.fb.group({
    DocType: [null, [Validators.required]],
    PRDate: [new Date(), [Validators.required]],
    ERPpr: [null, [Validators.required]],


  });

  PRLineForm = this.fb.group({
    Product: ['', [Validators.required]],
    Description: [''],
    ProductGroup: [''],
    Qty: ['', [Validators.required]],
    Unit: ['',[Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    Plant: ['', [Validators.required]],
    StorageLocation: ['', [Validators.required]],
  });

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

  PRLineItem: PurchaseRequisitionLine[] = [];
  dataSource = new MatTableDataSource<any>();
  index = 0;
  PRId!: number;
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'Description',
    'ProductGroup',
    'Qty',
    'Unit',
    'DeliveryDate',
    'Plant',
    'Location',
    'Edit',
    'Delete',
  ];
  minDate: Date = new Date();
  PRDetails!: PurchaseRequisitionDetailsVM;
  selectedLineId!: number;
  isEdit=false;
  IsNewselectedLine!: number;
  currentUserId!: number;
  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toast: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private prService: PurchaseRequistionService,
    private router: Router, private route: ActivatedRoute, private authService: AuthService,private location: Location) {
    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
      if (!this.PRId || this.PRId <= 0)
        this.router.navigateByUrl('/pages/purchase-requisition');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.apiDocType();
    this.apiProductList();
    this.apiPlantList();
    this.apuUnitList();
    this.apiStorageLocationList();

  }

  // all api initial
  apiGetPRDetailsById(prId: number) {
    this.prService
      .getPRDetailsById(prId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.PRDetails = res[ResultEnum.Model];
            if (this.PRDetails) {
              // if(this.PRDetails?.IsApprovedByAll || this.PRDetails?.IsRejected){
              //    this.toast.error('You can not update this PR');
              //    this.router.navigateByUrl('/pages/purchase-requisition');
              // }
              this.PRHeaderForm.patchValue({
                DocType: this.PRDetails.PRDocType as any,
                PRDate: this.formatDate(this.PRDetails.PRDate) as any,
                ERPpr: this.PRDetails.ERPPRNumber as any,
              });
            }
            this.PRDetails.PRLineItems?.forEach((item, index) => {
              this.PRLineItem.push({
                // Product: item.PlantCode,
                Product: this.productList?.find(x => x.ProductCode == item.ProductCode),
                ProductGroup: item.ProductGroup,
                ProductCode: item.ProductCode,
                Description: item.ProductDescription,
                Qty: item?.Qty,
                DeliveryDate: item?.DeliveryDate,
                Unit: this.unitList?.find(x => x.Id == item.UnitId),
                Plant: this.plantList?.find(x => x.Id == item.PlantId),
                StorageLocation: this.locationList?.find(x => x.Id == item.StorageLocationId),
                LineId: item?.Id,
                Id: index + 1
              });
            });

            this.dataSource.data = this.PRLineItem;
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
            this.apiGetPRDetailsById(this.PRId);
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
      return this.docTypeList.filter(doctype =>
        doctype?.Type?.toLowerCase().includes(name.Type.toLowerCase()));
    }
    else {
      return this.docTypeList.filter(doctype =>
        doctype?.Type?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterProducts(name: any) {
    if (name?.ProductCode) {
      return this.productList.filter(product =>
        product?.ProductCode?.toLowerCase().includes(name.ProductCode.toLowerCase()));
    }
    else {
      return this.productList.filter(product =>
        product?.ProductCode?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterUnit(name: any) {
    if (name?.UnitName || name?.MeasurementUnitName)
      return this.unitList.filter(unit =>
        unit?.UOM?.toLowerCase().indexOf(name.UOM.toLowerCase()) === 0 ||
        unit?.MeasurementUnitName?.toLowerCase().indexOf(name.MeasurementUnitName.toLowerCase()) === 0);
    else
      return this.unitList.filter(plant =>
        plant?.UnitName?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        plant?.MeasurementUnitName?.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterPlant(name: any) {
    if (name?.PlantCode || name?.PlantName)
      return this.plantList.filter(plant =>
        plant?.PlantName?.toLowerCase().indexOf(name.PlantName.toLowerCase()) === 0 ||
        plant?.PlantCode?.toLowerCase().indexOf(name.PlantCode.toLowerCase()) === 0);
    else
      return this.plantList.filter(plant =>
        plant?.PlantName?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        plant?.PlantCode?.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterStorageLocation(name: any) {
    if (name?.LocationCode || name?.LocationName) {
      return this.locationList.filter(location =>
        location?.LocationCode?.toLowerCase().includes(name.LocationCode.toLowerCase()) ||
        location?.LocationName?.toLowerCase().includes(name.LocationName.toLowerCase()));
    }
    else {
      return this.locationList.filter(location =>
        location?.LocationCode?.toLowerCase().includes(name.toLowerCase()) ||
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
      this.PRLineForm.get('Unit')?.setValue(product?.BaseUnit ? product?.BaseUnit : '');

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

    } else
      this.toast.error('Plant code not found');
  }

  async openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
    if (data) {
      this.isEdit=true;
      this.selectedLineId = data?.Id;
      this.minDate = data.DeliveryDate;
      await this.onChangePlant(data?.Plant?.PlantCode, true, data?.StorageLocation?.Id);
      this.PRLineForm.patchValue({
        // Product: data?.ProductCode,
        Product: this.productList?.find(x => x.ProductCode == data?.Product?.ProductCode) as any,
        Description: data?.Description,
        ProductGroup: data?.ProductGroup,
        Qty: data.Qty,
        Unit: data.Unit.UOM,
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


  onClickAddProduct() {
    const PRline = this.PRLineForm.value;
    if (this.selectedLineId > 0) {
      this.PRLineItem.forEach(item => {
        if (item?.Id == this.selectedLineId) {
          item.Product = PRline.Product as unknown as Products,
            item.ProductGroup = PRline.ProductGroup ? PRline.ProductGroup : '',
            item.Description = PRline.Description ? PRline.Description : '',
            item.Qty = PRline?.Qty as unknown as number,
            item.DeliveryDate = PRline?.DeliveryDate as unknown as Date,
            item.Unit = this.unitList?.find(x => x.UOM == PRline.Unit) as unknown as Units,
            item.Plant = PRline.Plant as unknown as Plants,
            item.StorageLocation = PRline.StorageLocation as unknown as StorageLocations,
            item.LineId = item.LineId,
            item.Id = item.Id;
        }
      });
    }
    else {
      this.PRLineItem.push({
        Product: PRline.Product as unknown as Products,
        ProductGroup: PRline.ProductGroup ? PRline.ProductGroup : '',
        Description: PRline.Description ? PRline.Description : '',
        Qty: PRline?.Qty as unknown as number,
        DeliveryDate: PRline?.DeliveryDate as unknown as Date,
        Unit: this.unitList?.find(x => x.UOM == PRline.Unit) as unknown as Units,
        Plant: PRline.Plant as unknown as Plants,
        StorageLocation: PRline.StorageLocation as unknown as StorageLocations,
        Id: this.PRLineItem.length + 1,
        LineId: 0
      });
    }
    this.isEdit=false;
    this.selectedLineId = 0;
    this.dataSource.data = this.PRLineItem;
  }


  openModelForDeleteItem(templateRef: TemplateRef<any>, data?: any) {
    console.log('data', data);
    if (this.PRLineItem?.length == 1)
      throw this.toast.error('PR must have one line item, you can not delete....');

    if (data?.LineId > 0) {
      this.selectedLineId = data?.Id;
    }
    else {
      this.IsNewselectedLine = data?.Id;
    }
    this.dialog.open(templateRef);
  }

  onClickDeleteItem() {
    if (this.selectedLineId) {
      const id = this.selectedLineId;
      this.PRLineItem.forEach((element, index) => {
        element.Id = index + 1;
        if (element.Id == id) {
          if (element?.LineId) {
            this.prService.deletePRLineByLineId(element.LineId ? element.LineId : 0).subscribe({
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
          this.PRLineItem.splice(index, 1);
        }
      });
      this.PRLineItem.forEach((element, index) => {
        element.Id = index + 1;
      });
    }
    else if (!this.selectedLineId && this.selectedLineId == 0) {
      const id = this.IsNewselectedLine;
      this.PRLineItem.forEach((element, index) => {
        element.Id = index + 1;
        if (element.Id == id) {
          this.PRLineItem.splice(index, 1);
        }
      });
      this.PRLineItem.forEach((element, index) => {
        element.Id = index + 1;
      });
    }
    this.dataSource = new MatTableDataSource<any>(this.PRLineItem);
    this.selectedLineId = 0;
    this.IsNewselectedLine = 0;
  }

  onClickCloseDialog(){
    this.selectedLineId = 0;
    this.dialog.closeAll();
  }

  onClickCreatePR() {
    this.PRHeaderForm.touched;
    if (this.PRHeaderForm.valid) {
      const PRHeaderData = this.PRHeaderForm.value;
      const PRDate = this.PRHeaderForm.get('PRDate')?.getRawValue();
      const PRDetails: PurchaseRequisitionDataVM = {
        Id: this.PRId,
        ERPPRNumber: this.PRDetails.ERPPRNumber,
        PRDocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        PRDate: PRDate ? PRDate : new Date(),
        PRLineItem: this.PRLineItem
      };

      this.prService.updatePR(PRDetails).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toast.success(res.Message);
            this.PRHeaderForm.reset();
            this.PRLineForm.reset();
            this.router.navigateByUrl('/pages/purchase-requisition');
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
  }
  onClickBack() {
    this.location.back();
  }
}

