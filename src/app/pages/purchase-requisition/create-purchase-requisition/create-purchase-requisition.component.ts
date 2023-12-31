import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { PurchaseRequisitionDataVM, PurchaseRequisitionLine } from '@core/models/purchase-requistion';
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
  selector: 'app-create-purchase-requisition',
  templateUrl: './create-purchase-requisition.component.html',
  styleUrls: ['./create-purchase-requisition.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' }
    }
  ]
})
export class CreatePurchaseRequisitionComponent implements OnInit {


  PRHeaderForm = this.fb.group({
    PRDate: [new Date(), [Validators.required]],
    DocType: [null, [Validators.required]],
    Plant: [null, [Validators.required]],
  });

  PRLineForm = this.fb.group({
    Product: ['', [Validators.required]],
    Description: [''],
    ProductGroup: [''],
    Qty: ['', [Validators.required]],
    Unit: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    StorageLocation: ['', [Validators.required]],
  });
  docTypeControl = new FormControl();
  searchUnitControl = new FormControl();
  searchProductControl = new FormControl();
  searchPlantControl = new FormControl();
  searchStorageLocationControl = new FormControl();

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
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'Description',
    'ProductGroup',
    'Qty',
    'Unit',
    'DeliveryDate',
    // 'Plant',
    'Location',
    'Edit',
    'Delete',
  ];
  currentDate: Date = new Date();
  selectedLineId!: number;
  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toaster: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private prService: PurchaseRequistionService,
    private router: Router, private authService: AuthService, private location: Location) {
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit(): void {

    this.PRHeaderForm.get('PRDate')?.disable();
    this.apiDocType();
    this.apiPlant();
    this.apiUnit();

    this.productService
      .getProductList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productList = res[ResultEnum.Model];
          this.productList.map(x => x.ProductFullName = x.ProductCode + (x.Description ? ' - ' + x.Description : ''));
          this.filteredProducts = this.searchProductControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProducts(value || ''))
          );
        }
      });


  }

  apiDocType() {
    this.docTypeSerivce.getAllDocType().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.docTypeList = res[ResultEnum.Model];
          this.filteredDocType = this.docTypeControl.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterDocType(value || ''))
          );
        }
        else {
          this.toaster.error(res.Message);
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  apiPlant() {
    this.plantService.getPlantList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
          this.filteredPlants = this.searchPlantControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPlant(value || ''))
          );
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  apiUnit() {
    this.unitService.getAllUnit().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.unitList = res[ResultEnum.Model];
          this.filteredUnits = this.searchUnitControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUnit(value || ''))
          );
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  apiProductByPlantCode(plantCode?: string) {
    this.productService.getProductListByPlantCode(plantCode).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.productList = res[ResultEnum.Model];
          if (this.productList?.length == 0)
            this.toaster.error('Product not found in this plant, please select other plant...');
          this.productList.map(x => x.ProductFullName = x.ProductCode + (x.Description ? ' - ' + x.Description : ''));
          this.filteredProducts = this.searchProductControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProducts(value || ''))
          );
        }
        else{
          this.toaster.error(res[ResultEnum.Message]);
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  filterDocType(value: string): DocTypes[] {

    const filterValue = value.toLowerCase();
    return this.docTypeList.filter(
      (docType) =>
        docType.Type && docType.Type.toLowerCase().includes(filterValue)
    );
  }
  // filterDocType(name: any) {
  //   if (name?.Type) {
  //     return this.docTypeList.filter(doctype =>
  //       doctype?.Type?.toLowerCase().includes(name.Type.toLowerCase()));
  //   }
  //   else {
  //     return this.docTypeList.filter(doctype =>
  //       doctype?.Type?.toLowerCase().includes(name.toLowerCase()));
  //   }
  // }

  filterProducts(name: any) {
    if (name?.ProductCode || name?.Description) {
      return this.productList.filter(product =>
        product?.ProductCode?.toLowerCase().includes(name.ProductCode.toLowerCase()) ||
        product?.Description?.toLowerCase().includes(name.Description.toLowerCase()));
    }
    else {
      return this.productList.filter(product =>
        product?.ProductCode?.toLowerCase().includes(name.toLowerCase()) ||
        product?.Description?.toLowerCase().includes(name.toLowerCase()));
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
    return product ? product.ProductCode + ' - ' + product.Description : '';
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

  openModelForAddItem(templateRef: TemplateRef<any>) {
    if (!this.PRHeaderForm.get('DocType')?.value) {
      this.PRHeaderForm.get('DocType')?.markAsTouched();
      throw this.toaster.error('Please select Doc Type...');
    }
    if (!this.PRHeaderForm.get('Plant')?.value) {
      this.PRHeaderForm.get('Plant')?.markAsTouched();
      throw this.toaster.error('Please select plant...');
    }
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  openModelForEditItem(templateRef: TemplateRef<any>, data?: any) {
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
    if (data) {
      this.selectedLineId = data?.Id;
      const PRHeaderData = this.PRHeaderForm.value as any;
      
      this.PRLineForm.patchValue({
        Product: this.productList?.find(x => x.ProductCode == data?.ProductCode) as any,
        Description: data?.Description,
        ProductGroup: data?.ProductGroup,
        Qty: data.Qty,
        Unit: data.Unit,
        DeliveryDate: data.DeliveryDate,
        // Plant: this.plantList?.find(x => x.Id == data?.Plant?.Id) as any,
        StorageLocation: this.locationList?.find(x => x.Id == data?.StorageLocation?.Id) as any
      });
      // this.onChangePlant(PRHeaderData?.Plant?.PlantCode as any, true, data?.StorageLocation?.Id);
    }
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  onKeyPressWithDot(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46) {
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    }
    return true;
  }

  onChangeProduct(event: any) {
    const product = this.productList.find(x => x.ProductCode?.toLowerCase() == event?.ProductCode?.toLowerCase());

    if (product) {
      this.PRLineForm.get('Description')?.setValue(product?.Description ? product?.Description : null);
      this.PRLineForm.get('ProductGroup')?.setValue(product?.ProductGroup ? product?.ProductGroup : '');
      this.PRLineForm.get('Unit')?.setValue(product?.PurchaseUnit ? product?.PurchaseUnit : '');
    }
  }


  onChangePlant(event: any, IsEdit = false, locationId?: number) {
    this.locationList = [];
    this.PRLineForm.get('StorageLocation')?.setValue(null);

    this.PRLineItem = [];
    this.dataSource.data = [];
    
    this.apiProductByPlantCode(event);
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
            this.filteredlocation = this.searchStorageLocationControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterStorageLocation(value || ''))
            );
          }
          else {
            this.toaster.error(res[ResultEnum.Message]);
          }
        });

    } else
      this.toaster.error('Plant code not found');
  }

  onClickAddProduct() {
    //Unit: this.unitList?.find(x => x.UOM == data?.Product?.BaseUnit) as any,
    const PRline = this.PRLineForm.value as any;
    
    if (this.selectedLineId > 0) {
      this.PRLineItem.forEach(item => {
        if (item?.Id == this.selectedLineId) {
          item.ProductId = PRline.Product?.Id as unknown as number,
          item.ProductCode = PRline.Product?.ProductCode ? PRline.Product?.ProductCode : '',
          item.ProductGroup = PRline.ProductGroup ? PRline.ProductGroup : '',
          item.Description = PRline.Description ? PRline.Description : '',
          item.Qty = PRline?.Qty as unknown as number,
          item.DeliveryDate = PRline?.DeliveryDate as unknown as Date,
          item.Unit = this.unitList?.find(x => x.UOM == PRline?.Unit?.UOM) as unknown as Units,
          item.UnitId = PRline.Unit?.Id as any,
          item.StorageLocationId = PRline.StorageLocation?.Id as any,
          // item.Plant = PRline.Plant as unknown as Plants,
          item.StorageLocation = PRline.StorageLocation as unknown as StorageLocations,
          item.LineId = item.LineId,
          item.Id = item.Id;
        }
      });
    }
    else {
      this.PRLineItem.push({
        ProductId : PRline.Product?.Id as unknown as number,
        ProductCode: PRline.Product?.ProductCode ? PRline.Product?.ProductCode : '',
        ProductGroup: PRline.ProductGroup ? PRline.ProductGroup : '',
        Description: PRline.Description ? PRline.Description : '',
        Qty: PRline?.Qty as unknown as number,
        DeliveryDate: PRline?.DeliveryDate as unknown as Date,
        Unit: this.unitList?.find(x => x.UOM == PRline?.Unit?.UOM) as unknown as Units,
        UnitId : PRline.Unit?.Id as any,
        StorageLocationId : PRline.StorageLocation?.Id as any,
        // Plant: PRline.Plant as unknown as Plants,
        StorageLocation: PRline.StorageLocation as unknown as StorageLocations,
        Id: this.PRLineItem.length + 1
      });
    }
    this.dataSource.data = this.PRLineItem;
    this.selectedLineId = 0;
  }

  onClickDeleteItem(id: any) {
    this.PRLineItem.forEach((element, index) => {
      element.Id = index + 1;
      if (element.Id == id)
        this.PRLineItem.splice(index, 1);
    });
    this.PRLineItem.forEach((element, index) => {
      element.Id = index + 1;
    });
    this.dataSource = new MatTableDataSource<any>(this.PRLineItem);
  }


  onClickCreatePR() {
    this.PRHeaderForm.touched;
    if (this.PRHeaderForm.valid) {
      const PRHeaderData = this.PRHeaderForm.value as any;
      const PRDate = this.PRHeaderForm.get('PRDate')?.getRawValue();
      const PRDetails: PurchaseRequisitionDataVM = {
        Id: 0,
        PRDocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        PRDate: PRDate ? PRDate : new Date(),
        PlantId: PRHeaderData?.Plant?.Id ? PRHeaderData?.Plant?.Id : 0,
        PRLineItem: this.PRLineItem
      };

      this.prService.createPR(PRDetails).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.PRHeaderForm.reset();
            this.PRLineForm.reset();
            this.router.navigateByUrl('/pages/purchase-requisition');
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
  }
  onClickBack() {
    this.location.back();
  }
}
