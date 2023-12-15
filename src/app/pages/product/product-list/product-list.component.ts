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
import { Units } from '@core/models/units';
import { PlantService } from '@core/services/plant.service';
import { ProductGroupService } from '@core/services/product-group.service';
import { ProductService } from '@core/services/product.service';
import { UnitService } from '@core/services/unit.service';
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
    IsBatchNo:[true],
    IsSerialNo:[false],
    IsActive: [false],

  });
  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    // 'ProductCode',
    'ERPProductCode',
    'Description',
    'ProductGroup',
    'BaseUnit',
    'PurchaseUnit',
    'SalesUnit',
    // 'StandardPrice',
    // 'MovingAvgPrice',
    // 'Plant',
    // 'IsBatchNo',
    // 'IsSerialNo',
    'IsActive',
    'View',
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
    private fb: FormBuilder,private toaster: ToastrService) { }

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

  openDeleteModel(templateRef: TemplateRef<any>, productId: number) {
    this.selectedProductId = productId;
    this.dialog.open(templateRef);
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

  IsBatchNoOrIsSerialNo(type:string, e:any, product: any){
    if(type == 'IsBatchNo'){
      product.IsBatchNo = e.srcElement.checked;
      this.updateProductService(product);
    }

    if(type == 'IsSerialNo'){
      product.IsSerialNo = e.srcElement.checked;
      this.updateProductService(product);
    }
  }

  updateProductService(product:any){
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

  IsActiveFlagUpdate(element:any,e:any){    
    element.IsActive = e.srcElement.checked;
    this.updateProductService(element);
  }
}
