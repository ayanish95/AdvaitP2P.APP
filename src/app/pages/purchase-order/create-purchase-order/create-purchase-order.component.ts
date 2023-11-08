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
import { PurchaseRequisitionDetailsVM, PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
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
import { PurchaseOrderDataVM, PurchaseOrderHeader, PurchaseOrderLine } from '@core/models/purchase-order';
import { States } from '@core/models/states';
import { StateService } from '@core/services/state.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';


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
    ContractNumber: [null],
    SupplierCode: [null, [Validators.required]],
    SupplierName: [''],
    RFQNumber: [null],
    PODate: [new Date(), [Validators.required]],
  });


  POLineForm = this.fb.group({
    Product: [''],
    Description: [''],
    ProductGroup: [''],
    Unit: [''],
    Qty: ['', [Validators.required]],
    NetPrice: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    StockType: ['', [Validators.required]],
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
  index = 0;
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'Description',
    'ProductGroup',
    'Qty',
    'Unit',
    'NetPrice',
    'TotalNetPrice',
    'GST',
    'IGST',
    'TaxAmount',
    'TotalAmount',
    'Currency',
    'DeliveryDate',
    'StockType',
    'Plant',
    'Location',
    'IsReturnItem',
    'IsFreeOfCharge',
    'Edit',
    'Delete',
  ];
  stockTypeList= [
    {'Id':'Unrestricted Stock', 'Type':'Unrestricted Stock'},
    {'Id':'Blocked Stock', 'Type':'Blocked Stock'},
    {'Id':'Quality Stock', 'Type':'Quality Stock'},
  ];
  filteredStockType!: Observable<any>;
  currentDate: Date = new Date();
  // prDetailsData: any;
  isSAPEnabled: string = 'false';
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;
  PRDetails!: PurchaseRequisitionDetailsVM;
  POLineItem: PurchaseOrderLine[] = [];
  supplierCurrency: string = 'INR';
  selectedSupplier!: Suppliers;
  stateList!: States[];
  selectedLineId!: number;
  minDate!: Date;
  companyCode!:string;

  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private productService: ProductService, private stateService: StateService,
    private storageLocationService: StorageLocationService, private toaster: ToastrService, private unitService: UnitService, private docTypeSerivce: DocTypeService, private supplierService: SupplierService, private prService: PurchaseRequistionService,
    private router: Router, private authService: AuthService,private purchaseOrderService:PurchaseOrderService) {
    this.dateAdapter.setLocale('en-GB');
    // DD/MM/YYYY
  }

  ngOnInit(): void {
    this.POHeaderForm.controls['PODate'].disable();
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
    this.apiSupplier();
    this.apiPRList();
    this.apiUnit();
    this.apiProductList();
    this.apiPlantList();
    this.apiStorageLocationList();
    this.apiState();
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

          // this.filteredProducts = this.PRLineForm.get('Product')!.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this.filterProducts(value || ''))
          // );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
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
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
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
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

  apiState() {
    this.stateService.getStateList()
      .pipe(finalize(() => { }))
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.stateList = res[ResultEnum.Model];
          // this.filteredStates = this.addressForm.get('state')!.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this.filterStates(value || ''))
          // );
        }
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

  suppliercodee(supplierCode: Suppliers) {
    return supplierCode ? supplierCode.SupplierCode! : ''; ``
  }

  prNumberDisplayFn(prno: any) {
    return prno ? prno?.Id : '';
  }
  prNumberDisplayForSAPFn(prno: any) {
    return prno ? prno?.ERPPRNumber : '';
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
  productDisplayFn(product: Products) {
    return product ? product.ProductCode! : '';
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

  onSelectChangeSupplier(event: any) {

    const supplier = this.suppliercodelist.find(x => x.SupplierCode?.toLowerCase() == event?.SupplierCode?.toLowerCase());
    if (supplier) {
      this.selectedSupplier = supplier;
      this.supplierCurrency = supplier?.Currency ? supplier?.Currency : 'INR';
      this.POHeaderForm.get('SupplierName')?.setValue(supplier.FirstName + ' ' + supplier.LastName);
    }
  }

  getprno(selectedPRNumber: number) {
    if (!this.POHeaderForm.get('SupplierCode')?.value) {
      this.POHeaderForm.get('SupplierCode')?.markAsTouched();
      this.POHeaderForm.get('PRno')?.setValue(null);
      throw this.toaster.error('Please select supplier code first...');
    }

    this.POLineItem = [];
    this.prService.getPRDetailsById(selectedPRNumber).subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.PRDetails = res[ResultEnum.Model];
        this.POHeaderForm.get('DocType')?.setValue(this.PRDetails?.PRDocType ? this.PRDetails?.PRDocType : '');
        this.PRDetails.PRLineItems?.forEach((item, index) => {
          let product = this.productList?.find(x => x.ProductCode == item.ProductCode);
          let netPrice = product?.PriceIndicator == 'S' ? product?.StandardPrice : product?.MovingAvgPrice;
          let totalNetPrice = Math.round(item?.Qty * (netPrice ? netPrice : 0));
          let plant = this.plantList?.find(x => x.Id == item.PlantId);
          let supplier = this.selectedSupplier;
          let plantState = this.stateList.find(x => x.Id == plant?.StateId as unknown as number);
          let IsGST = false;
          if(plant && !this.POHeaderForm.get('CompanyCode')?.value){
            this.POHeaderForm.get('CompanyCode')?.setValue(plant?.CompanyCode ? plant?.CompanyCode : '');
          }
          if (supplier?.State == plantState?.GSTStateCode)
            IsGST = true;
          let taxAmount = 0;

          if (product?.GST && totalNetPrice) {
            taxAmount = Math.round((totalNetPrice * product.GST) / 100);
          }
          let totalAmount = Math.round(totalNetPrice + taxAmount);
          this.POLineItem.push({
            Product: product,
            ProductGroup: item.ProductGroup,
            Description: item.ProductDescription,
            Qty: item?.Qty,
            DeliveryDate: item?.DeliveryDate,
            Unit: this.unitList?.find(x => x.Id == item.UnitId),
            Plant: this.plantList?.find(x => x.Id == item.PlantId),
            StorageLocation: this.locationList?.find(x => x.Id == item.StorageLocationId),
            NetPrice: netPrice,
            TotalNetPrice: totalNetPrice,
            Currency: this.supplierCurrency,
            GST: IsGST ? product?.GST : 0,
            IGST: !IsGST ? product?.GST : 0,
            TaxAmount: taxAmount,
            TotalAmount: totalAmount,
            StockType:'Unrestricted Stock',
            PRDetId: item?.Id,
            IsReturnItem: false,
            IsFreeOfCharge: false,
            LineId: 0,
            Id: index + 1
          });
        });
        this.dataSource.data = this.POLineItem;
      }
      else
        this.toaster.error(res[ResultEnum.Message]);
    });
  }

  calculateTotalForFooter(columnName:string) {
    return this.dataSource?.data?.map((element) => element[columnName])
      .reduce((acc, current) => acc + current, 0);
  }

  openModelForAddItem(templateRef: TemplateRef<any>, data?: any) {
    this.POLineForm.reset();
    this.POLineForm.controls['Product'].disable();
    this.POLineForm.controls['Description'].disable();
    this.POLineForm.controls['ProductGroup'].disable();
    this.POLineForm.controls['Unit'].disable();
    this.POLineForm.updateValueAndValidity();
    if (data) {
      this.selectedLineId = data?.Id;
      this.minDate = new Date(data.DeliveryDate);
      //this.onChangePlant(data?.Plant?.PlantCode, true, data?.StorageLocation?.Id);
      this.POLineForm.patchValue({
        Product: this.productList?.find(x => x.ProductCode == data?.Product?.ProductCode)?.ProductCode as any,
        Description: data?.Description,
        ProductGroup: data?.ProductGroup,
        Qty: data.Qty,
        Unit: this.unitList.find(x => x.Id == data?.Unit?.Id) as any,
        NetPrice: data?.NetPrice,
        DeliveryDate: data.DeliveryDate,
        StockType: data.StockType,
        IsReturnItem: data.IsReturnItem,
        IsFreeOfCharge: data.IsFreeOfCharge,
      });
      this.POLineForm.controls['DeliveryDate'].markAsTouched();
    }
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  onCheckChangeFreeOfCharge(event:any){
    if(event?.checked){
      this.POLineForm.get('NetPrice')?.setValue('0');
      this.POLineForm.get('NetPrice')?.disable();
    }
    else{
      this.POLineForm.get('NetPrice')?.enable();
    }
  }

  onClickUpdateProduct() {
    const POline = this.POLineForm.value;
    if (this.selectedLineId > 0) {
      this.POLineItem.forEach(item => {

        if (item?.Id == this.selectedLineId) {
          let IsFreeOfCharge = POline.IsFreeOfCharge;
          let netPrice = POline.NetPrice as unknown as number;
          if(!netPrice)
          netPrice =this.POLineForm.get('NetPrice')?.getRawValue();
          let qty = POline.Qty as unknown as number;
          let totalNetPrice = Math.round(qty * netPrice);
          let IsGST = false;
          if (item.GST)
            IsGST = true;
          let taxAmount = 0;
          if (totalNetPrice) {
            if (item.GST)
              taxAmount = Math.round((totalNetPrice * item.GST) / 100);
            else
              taxAmount = Math.round((totalNetPrice * (item.IGST ? item.IGST : 1)) / 100);
          }
          let totalAmount = 0;
          if (totalNetPrice) {
            totalAmount = Math.round(totalNetPrice + taxAmount)
          }


          item.Qty = qty;
          item.NetPrice = !IsFreeOfCharge ? netPrice : 0;
          item.TotalNetPrice = !IsFreeOfCharge ?  totalNetPrice : 0;
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
  }
  onClickCreatePO(){
    if (this.POLineItem?.length == 0)
    throw this.toaster.error('Please select alteast one product for create purchase order...');
    this.POHeaderForm.touched;
      if (this.POHeaderForm.valid) {
        const PRHeaderData = this.POHeaderForm.value as any;
        const PODetails: PurchaseOrderDataVM = {
          Id: 0,
          DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
          SupplierId: PRHeaderData.SupplierCode?.Id as any,
          SupplierCode: PRHeaderData.SupplierCode?.SupplierCode as any,
          SupplierName: PRHeaderData.SupplierName as any,
          PRHeaderId: PRHeaderData.PRno?.Id,
          ContractNumber: PRHeaderData.ContractNumber,
          RFQHeaderId: PRHeaderData.RFQNumber,
          CompanyCode: PRHeaderData.CompanyCode,
          PODate: PRHeaderData.PODate ? PRHeaderData.PODate : new Date(),
          TotalNetPrice: this.calculateTotalForFooter('TotalNetPrice'),
          TotalTaxAmount:this.calculateTotalForFooter('TaxAmount'),
          TotalPOAmount:this.calculateTotalForFooter('TotalAmount'),
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
  }}
}