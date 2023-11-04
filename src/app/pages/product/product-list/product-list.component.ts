import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { ProductGroup, Products } from '@core/models/products';
import { Suppliers } from '@core/models/suppliers';
import { Units } from '@core/models/units';
import { PlantService } from '@core/services/plant.service';
import { ProductGroupService } from '@core/services/product-group.service';
import { ProductService } from '@core/services/product.service';
import { RoleService } from '@core/services/role.service';
import { UnitService } from '@core/services/unit.service';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  productForm = this.fb.group({
    ProductGroup: ['', [Validators.required]],
    ProductDescription: ['', [Validators.required]],
    BaseUnit: ['', [Validators.required]],
    PurchaseUnit: ['', [Validators.required]],
    SalesUnit: ['', [Validators.required]],
    PriceIndicator: ['', [Validators.required]],
    StandardPrice: [''],
    MovingAvgPrice: [''],
    Plant: ['', [Validators.required]],
    HSNCode:['',[Validators.required]],
    GST:['',[Validators.required,Validators.min(0),Validators.max(28)]],
    IsActive: [false],

  });
  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'ERPProductCode',
    'Description',
    'ProductGroup',
    'BaseUnit',
    'StandardPrice',
    'MovingAvgPrice',
    'Plant',
    'Edit',
    'Delete',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  productList!: Products[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  unitList!: Units[];
  filteredBaseUnit!: Observable<Units[]>;
  filteredPurchaseUnit!: Observable<Units[]>;
  filteredSalesUnit!: Observable<Units[]>;
  productGroupList!: ProductGroup[];
  filteredProductGroup!: Observable<ProductGroup[]>;
  plantList!: Plants[];
  filteredPlant!: Observable<Plants[]>;
  selectedPriceIndicator!: string;
  selectedProductId!: number;
  priceIndicator = [
    { Id: 'S', Name: 'Standard Price' },
    { Id: 'V', Name: 'Moving Avg. Price' }
  ];
  productDetails!: Products;
  filteredPriceIndicator!: Observable<any[]>;
  isEdit = false;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;

  constructor(private productService: ProductService, private dialog: MatDialog, private authService: AuthService,
    private productGroupService: ProductGroupService,
    private unitService: UnitService, private plantService: PlantService,
    private fb: FormBuilder,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    //  Temporary comment  
    // if (this.isSAPEnabled == 'false')
    //   this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPProductCode');
    this.apiInitialize();

  }

  apiInitialize() {
    this.apiProductList();
    this.apiUnitList();
    this.apiProductGroup();
    this.apiPlantList();

    this.filteredBaseUnit = this.productForm.get('BaseUnit')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUnit(value || ''))
    );
    this.filteredPurchaseUnit = this.productForm.get('PurchaseUnit')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUnit(value || ''))
    );
    this.filteredSalesUnit = this.productForm.get('SalesUnit')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUnit(value || ''))
    );
    this.filteredProductGroup = this.productForm.get('ProductGroup')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProductGroup(value || ''))
    );
    this.filteredPriceIndicator = this.productForm.get('PriceIndicator')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPriceIndicator(value || ''))
    );
    this.filteredPlant = this.productForm.get('Plant')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPlant(value || ''))
    );
  }

  apiProductList() {
    this.productService
      .getProductList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productList = res[ResultEnum.Model];
          this.dataSource.data = this.productList;
          this.dataSource.paginator = this.paginator;
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
      });
  }

  apiUnitList() {
    this.unitService
      .getAllUnit()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.unitList = res[ResultEnum.Model];

        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiProductGroup() {
    this.productGroupService
      .getProductGroupList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productGroupList = res[ResultEnum.Model];

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
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });

  }

  filterUnit(name: any) {
    if (name?.UOM) {
      return this.unitList.filter(role =>
        role?.UOM?.toLowerCase().includes(name.UOM.toLowerCase()));
    }
    else {
      return this.unitList.filter(role =>
        role?.UOM?.toLowerCase().includes(name.toLowerCase()));
    }
  }
  filterProductGroup(name: any) {
    if (name?.ProductGroupName || name?.Description) {
      return this.productGroupList.filter(productgroup =>
        productgroup?.ProductGroupName?.toLowerCase().indexOf(name.ProductGroupName.toLowerCase()) === 0 ||
        productgroup?.Description?.toLowerCase().indexOf(name.Description.toLowerCase()) === 0);
    }
    else {
      return this.productGroupList.filter(productgroup =>
        productgroup?.ProductGroupName?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        productgroup?.Description?.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
  }


  filterPriceIndicator(name: any) {
    if (name?.Name || name?.Id) {
      return this.priceIndicator.filter(role =>
        role?.Name?.toLowerCase().includes(name.Name.toLowerCase()) ||
        role?.Id?.toLowerCase().includes(name.Id.toLowerCase()));
    }
    else {
      return this.priceIndicator.filter(role =>
        role?.Name?.toLowerCase().includes(name.toLowerCase()) ||
        role?.Id?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterPlant(name: any) {
    if (name?.PlantCode || name?.PlantName) {
      return this.plantList.filter(productgroup =>
        productgroup?.PlantCode?.toLowerCase().indexOf(name.PlantCode.toLowerCase()) === 0 ||
        productgroup?.PlantName?.toLowerCase().indexOf(name.PlantName.toLowerCase()) === 0);
    }
    else {
      return this.plantList.filter(productgroup =>
        productgroup?.PlantCode?.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        productgroup?.PlantName?.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
  }

  unitDisplayFn(role: Units) {
    return role ? role.UOM! : '';
  }

  priceIndicatorDisplayFn(role: any) {
    return role ? role?.Name! : '';
  }

  productGroupDisplayFn(productGroup: ProductGroup) {
    return productGroup ? productGroup.ProductGroupName + ' - ' + productGroup.Description! : '';
  }
  plantDisplayFn(plant: Plants) {
    return plant ? plant.PlantCode + ' - ' + plant.PlantName! : '';
  }

  searchSupplier(filterValue: any) {
    filterValue = filterValue.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageChange(page: PageEvent) {
    this.index = page.pageIndex * page.pageSize;
    this.filter.PageSize = page.pageSize;
    this.filter.Page = page.pageIndex + 1;
  }

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  onKeyPressWithDot(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if(charCode !=46){
    if (charCode > 31 && (charCode < 48 || charCode > 57) )
      return false;
    }
    return true;
  }

  openAddProductModel(templateRef: TemplateRef<any>) {
    this.isEdit = false;
    this.productForm.reset();
    this.productForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  openEditModelPopup(templateRef: TemplateRef<any>, productId: number) {
    this.selectedProductId = productId;
    this.isEdit = true;
    this.productForm.reset();
    this.productForm.updateValueAndValidity();
    this.productService
      .getProductDetailsById(productId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productDetails = res[ResultEnum.Model];
          if (this.productDetails) {
            this.selectedPriceIndicator = this.productDetails.PriceIndicator;
            this.productForm.patchValue({
              ProductGroup: this.productGroupList.find(x => x.ProductGroupName == this.productDetails.ProductGroup) as any,
              ProductDescription: this.productDetails.Description,
              BaseUnit: this.unitList.find(x => x.UOM == this.productDetails.BaseUnit) as any,
              PurchaseUnit: this.unitList.find(x => x.UOM == this.productDetails.PurchaseUnit) as any,
              SalesUnit: this.unitList.find(x => x.UOM == this.productDetails.SalesUnit) as any,
              PriceIndicator: this.priceIndicator.find(x => x.Id == this.productDetails.PriceIndicator) as any,
              StandardPrice: this.productDetails.StandardPrice?.toString(),
              MovingAvgPrice: this.productDetails.MovingAvgPrice?.toString(),
              Plant: this.plantList.find(x => x.PlantCode == this.productDetails.Plant) as any,
              HSNCode: this.productDetails.HSNCode,
              GST: this.productDetails.GST as any,
              IsActive: this.productDetails.IsActive,
            });
          }
          else {
            this.toaster.error('User not found');
          }
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  openDeleteModel(templateRef: TemplateRef<any>, productId: number) {
    this.selectedProductId = productId;
    this.dialog.open(templateRef);
  }

  onSelectPriceIndicator(event: any) {
    this.selectedPriceIndicator = event.source?.value?.Id;
    if (this.selectedPriceIndicator == 'S') {
      this.productForm.controls.StandardPrice.setValidators([Validators.required]);
      this.productForm.controls.MovingAvgPrice.setValidators(null);
    }
    else {
      this.productForm.controls.MovingAvgPrice.setValidators([Validators.required]);
      this.productForm.controls.StandardPrice.setValidators(null);
    }
    this.productForm.controls.StandardPrice.updateValueAndValidity();
    this.productForm.controls.MovingAvgPrice.updateValueAndValidity();
  }

  onClickAddOrUpdateProduct() {
    const productData = this.productForm.value as any;
    const product = {
      Id: this.isEdit ? this.selectedProductId : 0,
      ProductCode: '',
      Description: productData.ProductDescription,
      ProductGroup: productData.ProductGroup?.ProductGroupName,
      BaseUnit: productData.BaseUnit?.UOM,
      PurchaseUnit: productData.PurchaseUnit?.UOM,
      SalesUnit: productData.SalesUnit?.UOM,
      PriceIndicator: productData.PriceIndicator?.Id,
      StandardPrice: productData.StandardPrice ? productData.StandardPrice : 0,
      MovingAvgPrice: productData.MovingAvgPrice ? productData.MovingAvgPrice : 0,
      Plant: productData.Plant?.PlantCode,
      IsActive: this.isEdit ? productData.IsActive : true,
      HSNCode: productData.HSNCode,
      GST: productData.GST
    } as Products;

    if (!this.isEdit) {
      this.productService.addProduct(product).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.productForm.reset();
            this.apiProductList();
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
    else {
      this.productService.updateProduct(product).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.productForm.reset();
            this.apiProductList();
            this.selectedProductId = 0;
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

  onClickDeleteProduct() {
    if (this.selectedProductId == 0 || this.selectedProductId == undefined)
      throw this.toaster.error('Something went wrong');
    this.productService
      .deleteProduct(this.selectedProductId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiProductList();
          this.selectedProductId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
