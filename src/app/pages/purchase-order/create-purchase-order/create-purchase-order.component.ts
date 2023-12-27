import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Suppliers } from '@core/models/suppliers';
import { PurchaseRequisitionDetailsVM, PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { PurchaseRequisitionDetailsLine } from '@core/models/purchase-requistion';
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
import { PurchaseOrderVM, PurchaseOrderLineVM } from '@core/models/purchase-order';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { CompanyService } from '@core/services/company.service';
import { Company } from '@core/models/company';
import { Location } from '@angular/common';


@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.scss'],
})
export class CreatePurchaseOrderComponent implements OnInit {

  POHeaderForm = this.fb.group({
    DocType: ['', [Validators.required]],
    CompanyCode: [''],
    PRno: [null, [Validators.required]],
    Plant: [''],
    ContractNumber: [null],
    SupplierCode: [null, [Validators.required]],
    RFQNumber: [null],
    PODate: [new Date(), [Validators.required]],
  });


  POLineForm = this.fb.group({
    Product: [''],
    Description: [''],
    ProductGroup: [''],
    Unit: [''],
    Qty: ['', [Validators.required]],
    Tax: [''],
    NetPrice: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    StockType: ['', [Validators.required]],
    IsReturnItem: [false],
    IsFreeOfCharge: [false],
    StorageLocation: [''],
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
  companyCodeList!: Company[];
  filteredCompanyCode!: Observable<Company[]>;
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
    'PRNumber',
    'PRLineId',
    'Product',
    'ProductGroup',
    'Qty',
    'Unit',
    'NetPrice',
    'TotalNetPrice',
    'TaxPercentage',
    'TaxAmount',
    'TotalAmount',
    'Currency',
    'DeliveryDate',
    'StockType',
    // 'Plant',
    'Location',
    'IsReturnItem',
    'IsFreeOfCharge',
    'Edit',
    'Delete',
  ];
  stockTypeList = [
    { Id: 'Unrestricted Stock', Type: 'Unrestricted Stock' },
    { Id: 'Blocked Stock', Type: 'Blocked Stock' },
    { Id: 'Quality Stock', Type: 'Quality Stock' },
  ];
  filteredStockType!: Observable<any>;
  currentDate: Date = new Date();
  // prDetailsData: any;
  isSAPEnabled = 'false';
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;
  PRDetails!: PurchaseRequisitionDetailsVM[];
  POLineItem: PurchaseOrderLineVM[] = [];
  supplierCurrency = 'INR';
  selectedSupplier!: Suppliers;
  selectedLineId!: number;
  minDate!: Date;
  companyCode!: string;
  PRNoControl = new FormControl();

  supplierControl = new FormControl();
  docTypeControl = new FormControl();
  companyCodeControl = new FormControl();
  searchPlantControl = new FormControl();
  searchProductControl = new FormControl();

  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toaster: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService,
    private supplierService: SupplierService, private prService: PurchaseRequistionService, private companyService: CompanyService,private location: Location,
    private router: Router, private authService: AuthService, private purchaseOrderService: PurchaseOrderService) {
    this.dateAdapter.setLocale('en-GB');
    // DD/MM/YYYY
  }

  ngOnInit(): void {
    this.POHeaderForm.controls.PODate.disable();
    // this.POHeaderForm.controls['DocType'].disable();
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    this.apiInitialize();

    this.filteredStockType = this.POLineForm.get('StockType')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStockType(value || ''))
    );
  }

  apiInitialize() {
    this.apiDocType();
    this.apiCompanyCode();
    this.apiSupplier();
    // this.apiPRNoList();
    this.apiUnit();
    this.apiPlantList();
    //this.apiStorageLocationList();
  }

  apiDocType() {
    this.docTypeSerivce.getAllDocType().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.docTypeList = res[ResultEnum.Model];
          this.filteredDocType = this.docTypeControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterDocType(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      },
      error: (e) => { this.toaster.error(e.Message); }
    });
  }

  apiCompanyCode() {
    this.companyService.getCompanyList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.companyCodeList = res[ResultEnum.Model];
          this.filteredCompanyCode = this.companyCodeControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterCompanyCode(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      },
      error: (e) => { this.toaster.error(e.Message); }
    });
  }

  apiSupplier() {
    this.supplierService
      .getSupplierList().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.suppliercodelist = res[ResultEnum.Model];
            this.suppliercodelist.map(x => x.ShortName = x.SupplierCode + (x.FirstName ? ' - ' + x.FirstName : ''));
            this.filtersupplierCode = this.supplierControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterSupplier(value || ''))
            );
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        },
        error: (e) => { this.toaster.error(e.Message); }
      });
  }

  apiPRNoList(doctype?: string, plantId?: number) {
    this.prService
      .getAllPRNumberForPO(doctype, plantId).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.prlist = res[ResultEnum.Model];
            this.filteredprno = this.PRNoControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterPrno(value || ''))
            );
            if (!this.prlist.length)
              this.toaster.error(res[ResultEnum.Message]);
          }
          else{
            this.prlist = [];
            this.filteredprno = this.PRNoControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterPrno(value || ''))
            );
            this.toaster.error(res[ResultEnum.Message]);
          }
        },
        error: (e) => { this.toaster.error(e.Message); },
      });
  }

  apiUnit() {
    this.unitService
      .getAllUnit().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.unitList = res[ResultEnum.Model];
            this.filteredUnits = this.POLineForm.get('Unit')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterUnit(value || ''))
            );
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        },
        error: (e) => { this.toaster.error(e.Message); },
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
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  apiPlantList(companyCode?: string) {
    if (!companyCode) {
      this.plantService
        .getPlantList().subscribe({
          next: (res: any) => {
            if (res[ResultEnum.IsSuccess]) {
              this.plantList = res[ResultEnum.Model];
              this.filteredPlants = this.searchPlantControl!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterPlant(value || ''))
              );
            }
            else {
              this.toaster.error(res[ResultEnum.Message]);
            }
          },
          error: (e) => { this.toaster.error(e.Message); }
        });
    } else {
      this.plantService
        .getPlantListByCompanyCode(companyCode).subscribe({
          next: (res: any) => {
            if (res[ResultEnum.IsSuccess]) {
              this.plantList = res[ResultEnum.Model];
              this.filteredPlants = this.searchPlantControl!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterPlant(value || ''))
              );
            }
            else {
              this.plantList = [];
              this.filteredPlants = this.searchPlantControl!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterPlant(value || ''))
              );
              this.toaster.error(res[ResultEnum.Message]);
            }
          },
          error: (e) => { this.toaster.error(e.Message); }
        });
    }
  }

  apiStorageLocationList(plantCode: string) {
    this.storageLocationService.getStorageLocationByPlantCode(plantCode).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.locationList = res[ResultEnum.Model];
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
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

  filterCompanyCode(name: any) {
    return this.companyCodeList.filter(company =>
      company?.CompanyCode?.toLowerCase().includes(name.toLowerCase()) ||
      company?.CompanyName?.toLowerCase().includes(name.toLowerCase()));
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
          return this.prlist.filter(pr => pr?.ERPPRNumber?.toLowerCase().includes(name.toLowerCase()));
        }
        else
          return this.prlist;
      }
    }
  }

  filterSupplier(name: any) {
    return this.suppliercodelist.filter(Supplier =>
      Supplier?.SupplierCode?.toLowerCase().includes(name?.toLowerCase()) ||
      Supplier?.FirstName?.toLowerCase().includes(name?.toLowerCase()) ||
      Supplier?.LastName?.toLowerCase().includes(name?.toLowerCase())
    );
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

  filterPlant(name: any) {
    return this.plantList.filter(plant =>
      plant?.PlantName?.toLowerCase().includes(name?.toLowerCase()) ||
      plant?.PlantCode?.toLowerCase().includes(name?.toLowerCase()));
  }

  filterStockType(name: any) {
    return this.stockTypeList.filter(plant =>
      plant?.Type?.toLowerCase().includes(name?.toLowerCase()));
  }

  suppliercodee(supplierCode: Suppliers) {
    return supplierCode ? supplierCode.SupplierCode! : ''; ``;
  }
  unitDisplayFn(units: Units) {
    return units ? units.UOM + ' - ' + units.MeasurementUnitName! : '';
  }
  
  // openModelForAddItem(templateRef: TemplateRef<any>) {
  //   this.PRLineForm.reset();
  //   this.PRLineForm.updateValueAndValidity();
  //   this.dialog.open(templateRef, {
  //     width: '56vw',
  //     panelClass: 'custom-modalbox'
  //   });
  // }

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

  getPRNUmberList() {
    const docType = this.POHeaderForm.get('DocType')?.value;
    const plant = this.POHeaderForm.get('Plant')?.value as any;
    this.POHeaderForm.get('PRno')?.setValue(null);
    this.prlist = [];
    if (docType && plant) {
      this.apiPRNoList(docType, plant?.Id);
    }
    this.POLineItem = [];
    this.dataSource.data = [];
  }

  onChangeCompanyCode(event: any) {
    this.POHeaderForm.get('Plant')?.setValue(null);
    this.plantList = [];
    if (event && event?.CompanyCode) {
      this.apiPlantList(event?.CompanyCode);
    }
  }

  onChangePlant(event: any) {
    this.locationList = [];
    this.POLineForm.get('StorageLocation')?.setValue(null);
    if (event) {
      this.POHeaderForm.get('CompanyCode')?.setValue(this.companyCodeList.find(x => x.CompanyCode == event?.CompanyCode) as any);
      this.apiProductByPlantCode(event?.PlantCode);
      this.apiStorageLocationList(event?.PlantCode);
    }
  }

  onSelectChangeSupplier(event: any) {

    const supplier = this.suppliercodelist.find(x => x.SupplierCode?.toLowerCase() == event?.SupplierCode?.toLowerCase());
    if (supplier) {
      this.selectedSupplier = supplier;
      this.supplierCurrency = supplier?.Currency ? supplier?.Currency : 'INR';
      // this.POHeaderForm.get('SupplierName')?.setValue(supplier.FirstName + ' ' + supplier.LastName);
    }
  }

  getprno(selectedPRNumber: any) {
    let PRId: string;
    PRId = selectedPRNumber.map((x: any) => x.Id);
    this.POLineItem = [];
    this.dataSource.data = [];
    if (!PRId || PRId?.length == 0)
      return;
    this.prService.getPRDetailsForPO(PRId).subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.PRDetails = res[ResultEnum.Model];

        //  let plant = this.plantList.find(x => x.Id == this.PRDetails?.PlantId) as any;
        // this.POHeaderForm.get('DocType')?.setValue(this.PRDetails?.PRDocType ? this.PRDetails?.PRDocType : '');
        // this.POHeaderForm.get('CompanyCode')?.setValue(this.PRDetails?.CompanyCode ? this.PRDetails?.CompanyCode : '');
        // if (plant)
        //   this.POHeaderForm.get('Plant')?.setValue(plant);
        this.PRDetails.forEach(PRDetails => {
          PRDetails.PRLineItems?.forEach((item, index) => {
            const product = this.productList?.find(x => x.ProductCode == item.ProductCode);

            this.POLineItem.push({
              ERPPRNumber: item?.ERPPRNumber ? item?.ERPPRNumber : '',
              ProductId: item.ProductId,
              Product: item.Product,
              // ProductCode: item.ProductCode ? item.ProductCode : '',
              // ProductGroup: item.ProductGroup,
              // Description: item.ProductDescription,
              Qty: item?.Qty,
              DeliveryDate: item?.DeliveryDate,
              Unit: item?.Unit,
              UnitId: item.UnitId,
              // Plant: this.plantList?.find(x => x.Id == item.PlantId),
              // LocationCode: item?.LocationCode,
              // LocationDescription: item?.LocationDescription,
              StorageLocation: item.StorageLocation,
              StorageLocationId: item.StorageLocationId,
              NetPrice: item?.NetPrice,
              TotalNetPrice: item?.TotalNetPrice,
              Currency: this.supplierCurrency,
              Tax: item?.Tax,
              TaxAmount: item?.TaxAmount,
              TotalAmount: item?.TotalAmount,
              StockType: 'Unrestricted Stock',
              IsReturnItem: false,
              IsFreeOfCharge: false,
              PRHeaderId: item?.PRHeaderId,
              PRDetId: item?.Id,
              // PRLineId: item?.Id,
              Id: this.POLineItem?.length + 1,
            });
          });
        });
        this.dataSource.data = this.POLineItem;
      }
      else {
        this.POHeaderForm.get('DocType')?.setValue(null);
        this.POHeaderForm.get('CompanyCode')?.setValue(null);
        // this.POHeaderForm.reset();
        this.PRDetails = res[ResultEnum.Model];
        this.toaster.error(res[ResultEnum.Message]);
      }
    });
  }

  calculateTotalForFooter(columnName: string) {
    return this.dataSource?.data?.map((element) => element[columnName])
      .reduce((acc, current) => acc + current, 0);
  }

  openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    this.POLineForm.reset();
    this.POLineForm.controls.Product.disable();
    this.POLineForm.controls.Description.disable();
    this.POLineForm.controls.ProductGroup.disable();
    this.POLineForm.controls.Unit.disable();
    this.POLineForm.updateValueAndValidity();
    if (data) {
      this.selectedLineId = data?.Id;
      this.minDate = new Date(data.DeliveryDate);
      //this.onChangePlant(data?.Plant?.PlantCode, true, data?.StorageLocation?.Id);
      this.POLineForm.patchValue({
        Product: data?.Product?.ProductCode as any,
        Description: data?.Product?.Description,
        ProductGroup: data?.Product.ProductGroup,
        Qty: data.Qty,
        Tax: data.Tax,
        Unit: this.unitList.find(x => x.Id == data?.Unit?.Id) as any,
        NetPrice: data?.NetPrice,
        DeliveryDate: data.DeliveryDate,
        StockType: data.StockType,
        IsReturnItem: data.IsReturnItem,
        IsFreeOfCharge: data.IsFreeOfCharge,
      });
      this.POLineForm.controls.DeliveryDate.markAsTouched();
    }
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  onCheckChangeFreeOfCharge(event: any) {
    if (event?.checked) {
      this.POLineForm.get('NetPrice')?.setValue('0');
      this.POLineForm.get('NetPrice')?.disable();
    }
    else {
      this.POLineForm.get('NetPrice')?.enable();
    }
  }

  onClickUpdateProduct() {
    const POline = this.POLineForm.value;
    if (this.selectedLineId > 0) {
      this.POLineItem.forEach(item => {

        if (item?.Id == this.selectedLineId) {
          const IsFreeOfCharge = POline.IsFreeOfCharge;
          let netPrice = POline.NetPrice as unknown as number;
          if (!netPrice)
            netPrice = this.POLineForm.get('NetPrice')?.getRawValue();
          const qty = POline.Qty as unknown as number;
          const totalNetPrice = Math.round(qty * netPrice);
          const tax = POline?.Tax as unknown as number;
          let taxAmount = 0;
          if (totalNetPrice) {
            taxAmount = Math.round((totalNetPrice * (tax ? tax : 0)) / 100);
          }
          let totalAmount = 0;
          if (totalNetPrice) {
            totalAmount = Math.round(totalNetPrice + taxAmount);
          }


          item.Qty = qty;
          item.NetPrice = !IsFreeOfCharge ? netPrice : 0;
          item.TotalNetPrice = !IsFreeOfCharge ? totalNetPrice : 0;
          item.Tax = !IsFreeOfCharge ? tax : 0;
          item.TaxAmount = !IsFreeOfCharge ? taxAmount : 0;
          item.TotalAmount = !IsFreeOfCharge ? totalAmount : 0;
          item.StockType = POline.StockType as any;
          item.DeliveryDate = POline.DeliveryDate as unknown as Date;
          item.IsReturnItem = POline.IsReturnItem as any;
          item.IsFreeOfCharge = POline.IsFreeOfCharge as any;
        }
      });
    }
  }

  onClickOpenDeleteAlertPopup(templateRef: TemplateRef<any>, id?: any) {
    this.selectedLineId = id;
    this.dialog.open(templateRef, {
    });
  }

  onClickDeleteItem() {
    if (this.POLineItem?.length == 1)
      throw this.toaster.error('Purchase order must have one line item, you can not delete....');
    if (this.selectedLineId) {
      this.POLineItem.forEach((element, index) => {
        element.Id = index + 1;
        if (element.Id == this.selectedLineId)
          this.POLineItem.splice(index, 1);
      });
      this.POLineItem.forEach((element, index) => {
        element.Id = index + 1;
      });
      this.dataSource.data = this.POLineItem;
    }
    this.dialog.closeAll();
  }
  
  onClickCreatePO() {
    if (this.POLineItem?.length == 0)
      throw this.toaster.error('Please select alteast one product for create purchase order...');
    this.POHeaderForm.touched;
    if (this.POHeaderForm.valid) {
      const PRHeaderData = this.POHeaderForm.value as any;
      let PRHeaderIds = PRHeaderData.PRno?.map((x: any) => x.Id);
      const PODetails: PurchaseOrderVM = {
        Id: 0,
        DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        SupplierId: PRHeaderData.SupplierCode?.Id as any,
        PRHeaderId: PRHeaderIds,
        ContractNumber: PRHeaderData.ContractNumber,
        RFQHeaderId: PRHeaderData.RFQNumber,
        CompanyCode: PRHeaderData.CompanyCode?.CompanyCode,
        PODate: PRHeaderData.PODate ? PRHeaderData.PODate : new Date(),
        PlantId: PRHeaderData.Plant?.Id,
        TotalNetPrice: this.calculateTotalForFooter('TotalNetPrice'),
        TotalTaxAmount: this.calculateTotalForFooter('TaxAmount'),
        TotalPOAmount: this.calculateTotalForFooter('TotalAmount'),
        POLineItems: this.POLineItem
      };

      this.purchaseOrderService.createPO(PODetails).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.POHeaderForm.reset();
            this.POLineForm.reset();
            this.router.navigateByUrl('/pages/purchase-order');
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
