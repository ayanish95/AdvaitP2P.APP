import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { DocTypes } from '@core/models/doc-type';
import { Suppliers } from '@core/models/suppliers';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import {
  PurchaseRequisitionDetailsLine
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
import { PurchaseOrderVM, PurchaseOrderLineVM } from '@core/models/purchase-order';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { Company } from '@core/models/company';
import { CompanyService } from '@core/services/company.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-purchase-order',
  templateUrl: './edit-purchase-order.component.html',
  styleUrls: ['./edit-purchase-order.component.scss']
})
export class EditPurchaseOrderComponent implements OnInit {

  POHeaderForm = this.fb.group({
    DocType: [{ value: '', disabled: true }, [Validators.required]],
    CompanyCode: [{ value: '', disabled: true }],
    Plant: [{ value: '', disabled: true }],
    PRno: [{ value: '', disabled: true }],
    ContractNumber: [null],
    SupplierCode: [{ value: '', disabled: true }, [Validators.required]],
    RFQNumber: [null],
    PODate: [new Date(), [Validators.required]],
  });


  POLineForm = this.fb.group({
    Product: [''],
    Description: [''],
    ProductGroup: [''],
    Unit: [''],
    Tax: ['', [Validators.required]],
    Qty: ['', [Validators.required]],
    NetPrice: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    StockType: ['', [Validators.required]],
    // StorageLocation: ['', [Validators.required]],
    IsReturnItem: [false],
    IsFreeOfCharge: [false],
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
  companyCodeList!: Company[];
  filteredCompanyCode!: Observable<Company[]>;
  index = 0;
  displayedColumns: string[] = [
    'srNo',
    'ERPPRNUmber',
    'PRLineId',
    'ProductCode',
    'Description',
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
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;
  PODetails!: PurchaseOrderVM;
  POLineItem: PurchaseOrderLineVM[] = [];
  supplierCurrency = 'INR';
  selectedSupplier!: Suppliers;
  selectedLineId!: number;
  minDate!: Date;
  companyCode!: string;
  selectedPOId!: number;

  PRNoControl = new FormControl();
  supplierControl = new FormControl();
  docTypeControl = new FormControl();
  companyCodeControl = new FormControl();
  searchPlantControl = new FormControl();
  searchProductControl = new FormControl();


  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService,
    private storageLocationService: StorageLocationService, private toaster: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private supplierService: SupplierService,
    private prService: PurchaseRequistionService, private poService: PurchaseOrderService, private companyService: CompanyService,private location: Location,
    private router: Router, private authService: AuthService, private purchaseOrderService: PurchaseOrderService, private route: ActivatedRoute,) {
    this.route.queryParams.subscribe((params: any) => {
      this.selectedPOId = params.id;
      if (!this.selectedPOId || this.selectedPOId <= 0)
        this.router.navigateByUrl('/pages/purchase-order');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
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

  apiGetPODetailsById(prId: number) {
    this.poService
      .getPODetailsById(prId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.PODetails = res[ResultEnum.Model];
            if (this.PODetails) {
              this.POHeaderForm.patchValue({
                DocType: this.PODetails?.DocType as any,
                PODate: this.PODetails?.PODate as any,
                SupplierCode: this.PODetails?.Supplier?.SupplierCode + ' - ' + this.PODetails?.Supplier?.FirstName + ' ' + this.PODetails?.Supplier?.LastName as any,
                // SupplierName: this.PODetails?.SupplierName as any,
                //PRno: this.PODetails?.PRHeaderId as any,
                ContractNumber: this.PODetails?.ContractNumber as any,
                RFQNumber: this.PODetails?.RFQHeaderId as any,
                CompanyCode: this.PODetails?.CompanyCode as any,
                PRno:this.PODetails.ERPPRNumber as any
              });
            }
            this.PODetails.POLineItems?.forEach((item, index) => {

              this.POLineItem.push({
                Product: item?.Product,
                ERPPRNumber: item?.ERPPRNumber,
                Qty: item?.Qty,
                DeliveryDate: item?.DeliveryDate,
                Unit: item?.Unit,
                StorageLocation: item?.StorageLocation,
                StorageLocationId: item.StorageLocationId,
                NetPrice: item?.NetPrice,
                TotalNetPrice: item?.TotalNetPrice,
                Currency: item?.Currency,
                Tax: item?.Tax,
                TaxAmount: item?.TaxAmount,
                TotalAmount: item?.TotalAmount,
                StockType: item?.StockType,
                PRDetId: item?.PRDetId,
                IsReturnItem: item.IsReturnItem,
                IsFreeOfCharge: item.IsFreeOfCharge,
                POLineId: item?.Id,
                IsDeleted:false,
                Id: index + 1
              });
            });

            this.dataSource.data = this.POLineItem;
            // this.dataSource.data = this.PRDetails.PRLineItems;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiInitialize() {
    // this.apiDocType();
    // this.apiSupplier();
    // this.apiPRList();
    this.apiUnit();
    this.apiProductList();
    this.apiPlantList();
    // this.apiStorageLocationList();
    this.apiCompanyCode();
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
          this.filteredUnits = this.POLineForm.get('Unit')!.valueChanges.pipe(
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

          this.apiGetPODetailsById(this.selectedPOId);
          // this.filteredProducts = this.PRLineForm.get('Product')!.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this.filterProducts(value || ''))
          // );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
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

  apiPRNoList(doctype?: string, plantId?: number) {
    this.prService
      .getAllPRNumberForPO(doctype, plantId).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.prlist = res[ResultEnum.Model];
            if (!this.prlist.length)
              this.toaster.error(res[ResultEnum.Message]);

            this.filteredprno = this.PRNoControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterPrno(value || ''))
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
    return this.productList.filter(product =>
      product?.ProductCode?.toLowerCase().includes(name.toLowerCase()) ||
      product?.Description?.toLowerCase().includes(name.toLowerCase()));
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
          return this.prlist.filter(pr => pr?.Id == name);
        }
        else
          return this.prlist;
      }
    }
  }

  filterSupplier(name: any) {
    if (name?.SupplierCode) {
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

  filterStockType(name: any) {
    if (name?.Type)
      return this.stockTypeList.filter(unit =>
        unit?.Type?.toLowerCase().indexOf(name.Type.toLowerCase()) === 0);
    else
      return this.stockTypeList.filter(plant =>
        plant?.Type?.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  unitDisplayFn(units: Units) {
    return units ? units.UOM + ' - ' + units.MeasurementUnitName! : '';
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

  getPRNUmberList() {
    const docType = this.POHeaderForm.get('DocType')?.value;
    const plant = this.POHeaderForm.get('Plant')?.value as any;
    if (docType && plant) {
      this.apiPRNoList(docType, plant?.Id);
    }
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
    // this.POLineForm.get('StorageLocation')?.setValue(null);
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
        ProductGroup: data?.Product?.ProductGroup,
        Tax: data.Tax,
        Qty: data.Qty,
        Unit: data?.Unit as any,
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
    const POline = this.POLineForm.value as any;
    if (this.selectedLineId > 0) {
      this.POLineItem.forEach(item => {

        if (item?.Id == this.selectedLineId) {
          const IsFreeOfCharge = POline.IsFreeOfCharge;
          let netPrice = POline.NetPrice as unknown as number;
          if (!netPrice)
            netPrice = this.POLineForm.get('NetPrice')?.getRawValue();
          const qty = POline.Qty as unknown as number;
          const totalNetPrice = Math.round(qty * netPrice);

          let taxAmount = 0;
          if (totalNetPrice) {
            taxAmount = Math.round((totalNetPrice * (POline.Tax ? POline.Tax : 0)) / 100);
          }
          let totalAmount = 0;
          if (totalNetPrice) {
            totalAmount = Math.round(totalNetPrice + taxAmount);
          }


          item.Qty = qty;
          item.NetPrice = !IsFreeOfCharge ? netPrice : 0;
          item.TotalNetPrice = !IsFreeOfCharge ? totalNetPrice : 0;
          item.Tax = !IsFreeOfCharge ? POline.Tax : 0;
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

    const id = this.selectedLineId;
    const index: number = this.POLineItem.findIndex(x => x.Id == this.selectedLineId);
    if (index !== -1) {
      this.POLineItem[index].IsDeleted=true;
    }
    this.dataSource.data = this.POLineItem.filter(x=>x.IsDeleted==false);
  
    //Currently commented code for direct delete from database
    // this.POLineItem.forEach((element, index) => {
      //   element.Id = index + 1;
      //   if (element.Id == id) {
        //     if (element?.POLineId) {
    //       this.poService.deletePOLineByLineId(element.POLineId ? element.POLineId : 0).subscribe({
    //         next: (res: any) => {
    //           if (res[ResultEnum.IsSuccess]) {
    //             this.toaster.success(res.Message);
    //             this.POLineItem.splice(index, 1);
    //             this.POLineItem.forEach((element, index) => {
    //               element.Id = index + 1;
    //             });
    //             this.dataSource = new MatTableDataSource<any>(this.POLineItem);
    //           }
    //           else {
    //             this.toaster.error(res.Message);
    //           }
    //         },
    //         error: (e) => { this.toaster.error(e.Message); },
    //         complete() {

    //         },
    //       });
    //     }
    //     this.dialog.closeAll();

    //   }
    // });
    this.dialog.closeAll();
    this.selectedLineId = 0;
  }
  onClickUpdatePO() {
    if (this.POLineItem?.length == 0)
      throw this.toaster.error('Please select alteast one product for create purchase order...');
    if (!this.selectedPOId)
      throw this.toaster.error('You have not select any purchase order...');
    this.POHeaderForm.touched;
    if (this.POHeaderForm.valid) {
      const PRHeaderData = this.POHeaderForm.value as any;
      const PODetails: PurchaseOrderVM = {
        Id: this.selectedPOId,
        DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        SupplierId: PRHeaderData.SupplierCode?.Id as any,
        // SupplierCode: PRHeaderData.SupplierCode?.SupplierCode as any,
        // SupplierName: PRHeaderData.SupplierName as any,
        PRHeaderId: PRHeaderData.PRno?.Id,
        ContractNumber: PRHeaderData.ContractNumber,
        RFQHeaderId: PRHeaderData.RFQNumber,
        CompanyCode: PRHeaderData.CompanyCode,
        PODate: PRHeaderData.PODate ? PRHeaderData.PODate : new Date(),
        TotalNetPrice: this.calculateTotalForFooter('TotalNetPrice'),
        TotalTaxAmount: this.calculateTotalForFooter('TaxAmount'),
        TotalPOAmount: this.calculateTotalForFooter('TotalAmount'),
        POLineItems: this.POLineItem
      };

      this.purchaseOrderService.updatePO(PODetails).subscribe({
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