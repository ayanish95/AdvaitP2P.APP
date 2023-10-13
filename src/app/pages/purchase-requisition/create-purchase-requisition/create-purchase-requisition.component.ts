import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
    DocType: [null, [Validators.required]],
    PRDate: [new Date(), [Validators.required]],
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

  PRLineItem:PurchaseRequisitionLine[]=[];
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
    'Plant',
    'Location',
  ];
  currentDate:Date=new Date();

  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toast: ToastrService,private unitService:UnitService,private docTypeSerivce:DocTypeService,private prService:PurchaseRequistionService,
    private router: Router) {
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit(): void {
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
          this.filteredProducts = this.PRLineForm.get('Product')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProducts(value || ''))
          );
        }
      });

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

  filterDocType(name: any) {
    if (name?.Type){
      return this.docTypeList.filter(doctype =>
        doctype?.Type?.toLowerCase().includes(name.Type.toLowerCase()));
    }
    else{
      return this.docTypeList.filter(doctype =>
        doctype?.Type?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterProducts(name: any) {
    if (name?.ProductCode){
      return this.productList.filter(product =>
        product?.ProductCode?.toLowerCase().includes(name.ProductCode.toLowerCase()));
    }
    else{
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
    if (name?.LocationCode || name?.LocationName){
    return this.locationList.filter(location =>
      location?.LocationCode?.toLowerCase().includes(name.LocationCode.toLowerCase()) || 
      location?.LocationName?.toLowerCase().includes(name.LocationName.toLowerCase()));
    }
    else{
      return this.locationList.filter(location =>
        location?.LocationCode?.toLowerCase().includes(name.toLowerCase()) || 
        location?.LocationName?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  docTypeDisplayFn(docType: DocTypes){
    return docType ?  docType.Type! : '';
  }

  productDisplayFn(product: Products){
    return product ?  product.ProductCode! : '';
  }

  unitDisplayFn(units: Units) {
    return units ?  units.UOM + ' - ' + units.MeasurementUnitName! : '';
  }

  plantDisplayFn(user: Plants) {
    return user ?  user.PlantCode + ' - ' + user.PlantName! : '';
  }

  storageLocationDisplayFn(location: StorageLocations) {
    return location ?  location.LocationCode + ' - ' + location.LocationName! : '';
  }

  openModelForAddItem(templateRef: TemplateRef<any>) {
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  onKeyPress(evt:any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  getPosts(event: any) {
    const product = this.productList.find(x => x.ProductCode?.toLowerCase() == event?.ProductCode?.toLowerCase());
    if (product) {
      this.PRLineForm.get('Description')?.setValue(product?.Description?product?.Description:null);
      this.PRLineForm.get('ProductGroup')?.setValue(product?.ProductGroup ? product?.ProductGroup : '');
    }
  }

  
  onChangePlant(event: any) {
    this.locationList=[];
    this.PRLineForm.get('StorageLocation')?.setValue(null);
    if (event.option?.value?.PlantCode) {
      this.storageLocationService.getStorageLocationByPlantCode(event.option?.value?.PlantCode).pipe(
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

    }else
    this.toast.error('Plant code not found');
  }

  onClickAddProduct(){
    const PRline=this.PRLineForm.value;
    this.PRLineItem.push({
      Product: PRline.Product as unknown as Products,
      ProductGroup: PRline.ProductGroup ? PRline.ProductGroup : '',
      Description: PRline.Description ? PRline.Description : '',
      Qty: PRline?.Qty as unknown as number,
      DeliveryDate: PRline?.DeliveryDate as unknown as Date,
      Unit: PRline.Unit as unknown as Units,
      Plant: PRline.Plant as unknown as Plants,
      StorageLocation: PRline.StorageLocation as unknown as StorageLocations,
      Id: this.PRLineItem.length + 1
    });
    this.dataSource.data = this.PRLineItem;
  }

  onClickCreatePR(){
    this.PRHeaderForm.touched;
    if(this.PRHeaderForm.valid){
      const PRHeaderData= this.PRHeaderForm.value;
      const PRDetails : PurchaseRequisitionDataVM = {
        Id:0,
        PRDocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        PRDate:PRHeaderData.PRDate ? PRHeaderData.PRDate : new Date(),
        PRLineItem: this.PRLineItem
      };

      this.prService.createPR(PRDetails).subscribe({
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
}
