import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Suppliers } from '@core/models/suppliers';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import {
  PurchaseRequisitionDataVM, PurchaseRequisitionLine, PurchaseRequisitionDetailsLine
} from '@core/models/purchase-requistion';
import { StorageLocations } from '@core/models/storage-location';
import { Units } from '@core/models/units';
import { DocTypeService } from '@core/services/doc-type.service';
import { SupplierService } from '@core/services/supplier.service';
import { PlantService } from '@core/services/plant.service';
import { ProductService } from '@core/services/product.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { StorageLocationService } from '@core/services/storage-location.service';
import { UnitService } from '@core/services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { AuthService } from '@core';
import { Role } from '@core/enums/role';


@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.scss'],
})
export class CreatePurchaseOrderComponent {

  POHeaderForm = this.fb.group({
    DocType: [null, [Validators.required]],
    CompanyCode: [null, [Validators.required]],
    PRno: [null, [Validators.required]],
    ContrctNumber: [null, [Validators.required]],
    SupplierCode: [null, [Validators.required]],
    SupplierName: [''],
    RFQNumber: [null, [Validators.required]],
    PODate: [new Date(), [Validators.required]],
  });


  PRLineForm = this.fb.group({
    DocType: [null, [Validators.required]],
    Product: ['', [Validators.required]],
    Description: [''],
    ProductGroup: [''],
    RfqNumber: ['', [Validators.required]],
    PODate: ['', [Validators.required]],
    supplier: ['', [Validators.required]],
    PRno: ['', [Validators.required]],
    CompanyCode: ['', [Validators.required]],
    Unit: ['', [Validators.required]],
  });

  plantList!: Plants[];
  filteredPlants!: Observable<any>;

  unitList!: Units[];
  filteredUnits!: Observable<any>;
  prlist!: PurchaseRequisitionHeader[];
  filteredprno!: Observable<PurchaseRequisitionHeader[]>;
  suppliercodelist!: Suppliers[];
  filtersupplierCode!: Observable<Suppliers[]>;
  docTypeList!: DocTypes[];
  filteredDocType!: Observable<DocTypes[]>;
  productList!: Products[];
  filteredProducts!: Observable<Products[]>;
  locationList!: StorageLocations[];
  filteredlocation!: Observable<StorageLocations[]>;
  Prlistno!: PurchaseRequisitionDetailsLine[];
  filterprlist!: Observable<PurchaseRequisitionDetailsLine[]>;
  prDetailsData: PurchaseRequisitionDetailsLine[] = [];
  dataSource = new MatTableDataSource<any>();
  index = 0;
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'Description',
    'ProductGroup',
    'Qty',
    'Unit',
    'GST',
    'IGST',
    'SGST',
    'UnitPrice',
    'TotalPrice',
    'DeliveryDate',
    'Plant',
    'Location',
    'Edit',
    'Delete',
  ];
  currentDate: Date = new Date();
  // prDetailsData: any;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;


  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toaster: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private supplierService: SupplierService, private prService: PurchaseRequistionService,
    private router: Router, private authService: AuthService,) {
    this.dateAdapter.setLocale('en-GB');
    // DD/MM/YYYY
  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    this.apiInitialize();
  }

  apiInitialize() {
    this.apiDocType();
    this.apiSupplier();
    this.apiPRList();
    this.apiUnit();
    this.apiProductList();
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
          this.filteredDocType = this.POHeaderForm.get('DocType')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterDocType(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

      });
  }

  apiSupplier() {
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
          this.filtersupplierCode = this.POHeaderForm.get('SupplierCode')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterSupplier(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiPRList() {
    this.prService
      .getAllPRHeaderList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.prlist = res[ResultEnum.Model];

          this.filteredprno = this.POHeaderForm.get('PRno')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPrno(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiUnit() {
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
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiProductList() {
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

          // this.filteredProducts = this.PRLineForm.get('Product')!.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this.filterProducts(value || ''))
          // );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

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

  filterPrno(name: any) {
    if (this.isSAPEnabled == 'true') {
      if (name?.ERPPRNumber) {
        return this.prlist.filter(pr =>
          pr?.ERPPRNumber?.toLowerCase().includes(name.ERPPRNumber.toLowerCase()));

      }
      else {
        return this.prlist.filter(pr =>
          pr?.ERPPRNumber?.toLowerCase().includes(name.toLowerCase()));
      }
    }
    else {
      if (name?.Id) {
        return this.prlist.filter(pr =>
          pr?.Id == name.Id);

      }
      else {
        if (name) {
          return this.prlist.filter(pr => pr?.Id == name);
        }
        else
          return this.prlist;
      }
    }
  }

  filterSupplier(name: any) {
    if (name?.supplierCode) {
      return this.suppliercodelist.filter(Supplier =>
        Supplier?.SupplierCode?.toLowerCase().includes(name.SupplierCode.toLowerCase()));
    }
    else {
      return this.suppliercodelist.filter(Supplier =>
        Supplier?.SupplierCode?.toLowerCase().includes(name.toLowerCase()));
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

  suppliercodee(supplierCode: Suppliers) {
    return supplierCode ? supplierCode.SupplierCode! : ''; ``
  }

  prNumberDisplayFn(prno: any) {
    return prno ? this.isSAPEnabled == 'true' ? prno.Id! : prno?.ERPPRNumber! :  '';
  }


  docTypeDisplayFn(docType: DocTypes) {
    return docType ? docType.Type! : '';
  }

  supplierDisplayFn(supplier: Suppliers) {
    return supplier ? supplier.SupplierCode! : '';
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
    this.PRLineForm.reset();
    this.PRLineForm.updateValueAndValidity();
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

  getPosts(event: any) {

    const supplier = this.suppliercodelist.find(x => x.SupplierCode?.toLowerCase() == event?.SupplierCode?.toLowerCase());
    if (supplier) {
      this.POHeaderForm.get('SupplierName')?.setValue(supplier.FirstName + ' ' + supplier.LastName);
    }
  }

  getprno(selectedPRNumber: number) {
    this.prService.getPRDetailsById(selectedPRNumber).subscribe(response => {
      // console.log(response);

      // Update the prData array with the received data
      this.dataSource.data = response.Model.PRLineItems;
      console.log(' response.Model.PRLineItems', response.Model.PRLineItems);

    });
  }
}


// onClickDeleteItem(id: any) {
//   this.PRLineItem.forEach((element, index) => {
//     element.Id = index + 1;
//     if (element.Id == id)
//       this.PRLineItem.splice(index, 1);
//   });
//   this.PRLineItem.forEach((element, index) => {
//     element.Id = index + 1;
//   });
//   this.dataSource = new MatTableDataSource<any>(this.PRLineItem);
// }

// onClickCreatePR() {
//   this.PRHeaderForm.touched;
//   if (this.PRHeaderForm.valid) {
//     const PRHeaderData = this.PRHeaderForm.value;
//     const PRDetails: PurchaseRequisitionDataVM = {
//       Id: 0,
//       PRDocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
//       PRDate: PRHeaderData.PRDate ? PRHeaderData.PRDate : new Date(),
//       PRLineItem: this.PRLineItem
//     };

// this.prService.createPR(PRDetails).subscribe({
//   next: (res: any) => {
//     if (res[ResultEnum.IsSuccess]) {
//       this.toast.success(res.Message);
//       this.PRHeaderForm.reset();
//       this.PRLineForm.reset();
//       this.router.navigateByUrl('/pages/purchase-requisition');
//     }
//     else {
//       this.toast.error(res.Message);
//     }
//   },
//   error: (e) => { this.toast.error(e.Message); },
//   complete() {

//   },
// });



