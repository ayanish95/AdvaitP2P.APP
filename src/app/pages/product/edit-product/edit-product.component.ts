import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { Products, ProductGroup, ProductPlantMapping } from '@core/models/products';
import { Units } from '@core/models/units';
import { PlantService } from '@core/services/plant.service';
import { ProductGroupService } from '@core/services/product-group.service';
import { ProductService } from '@core/services/product.service';
import { UnitService } from '@core/services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm = this.fb.group({
    ProductGroup: ['', [Validators.required]],
    ProductDescription: ['', [Validators.required, Validators.minLength(4)]],
    BaseUnit: ['', [Validators.required]],
    PurchaseUnit: ['', [Validators.required]],
    SalesUnit: ['', [Validators.required]],
    GST: ['', [Validators.required, Validators.min(0), Validators.max(28)]],
    Height: [''],
    Width: [''],
    Length: [''],
    Weight: [''],
    IsActive: [false]
  });

  displayedColumns: string[] = [
    'srNo',
    'Plant',
    'PriceIndicator',
    'StandardPrice',
    'MovingAvgPrice',
    'HSNCode',
    'IsBatchNo',
    'IsSerialNo',
    'Edit',
    'Delete',
  ];

  currentPage = 1;
  pageSize = 10;
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
  productPlantMappingList: ProductPlantMapping[] = [];
  filteredPriceIndicator!: Observable<any[]>;
  isEdit = false;
  dataSource = new MatTableDataSource<any>();
  searchProductGroupControl = new FormControl();
  searchBaseUOMControl = new FormControl();
  searchPurchaseUOMControl = new FormControl();
  searchSalesUOMControl = new FormControl();
  searchPlantControl = new FormControl();
  searchPriceIndicatorControl = new FormControl();
  productPlantForm!: FormGroup;
  constructor(private productService: ProductService, private dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute,
    private productGroupService: ProductGroupService, private router: Router, private unitService: UnitService, private plantService: PlantService,
    private fb: FormBuilder, private toaster: ToastrService) {

    this.route.queryParams.subscribe((params: any) => {
      this.selectedProductId = params.id;
      if (!this.selectedProductId || this.selectedProductId <= 0)
        this.router.navigateByUrl('/masters/product');
    });
  }

  ngOnInit() {
    this.apiUnitList(); // API unit list
    this.apiProductGroup(); //API product group
    this.apiPlantList(); //API plant list

    //Search price indicator
    this.filteredPriceIndicator = this.searchPriceIndicatorControl!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPriceIndicator(value || ''))
    );
    this.productPlantForm = this.fb.group({
      Id: [''],
      Plant: ['', [Validators.required]],
      PriceIndicator: ['', [Validators.required]],
      StandardPrice: ['', [Validators.required]],
      MovingAvgPrice: ['', [Validators.required]],
      HSNCode: ['', [Validators.required]],
      IsBatchNo: [false],
      IsSerialNo: [false]
    });
    this.apiInitialize(); //API Initialize
  }

  //Funcation for api initialize
  apiInitialize() {
    this.apiGetProductDetailsById();
  }

  //API get product details by Id
  apiGetProductDetailsById() {
    this.productService
      .getProductDetailsById(this.selectedProductId).subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productDetails = res[ResultEnum.Model];
          if (this.productDetails) {
            this.productForm.patchValue({
              ProductGroup: this.productGroupList.find(x => x.ProductGroupName == this.productDetails?.ProductGroup) as any,
              ProductDescription: this.productDetails?.Description,
              BaseUnit: this.unitList?.find(x => x.UOM == this.productDetails?.BaseUnit) as any,
              PurchaseUnit: this.unitList?.find(x => x.UOM == this.productDetails?.PurchaseUnit) as any,
              SalesUnit: this.unitList?.find(x => x.UOM == this.productDetails?.SalesUnit) as any,
              GST: this.productDetails?.GST as any,
              Height: this.productDetails?.Height as any,
              Width: this.productDetails?.Width as any,
              Length: this.productDetails?.Length as any,
              Weight: this.productDetails?.Weight as any,
            });
            this.productDetails?.ProductPlantMapping?.forEach(element => {
              this.productPlantMappingList.push({
                SRNo: this.productPlantMappingList.length + 1,
                Id: element.Id,
                PlantId: element?.PlantId,
                PlantCode: element?.PlantCode,
                PlantName: element?.PlantName,
                PriceIndicator: element?.PriceIndicator,
                StandardPrice: element?.StandardPrice,
                MovingAvgPrice: element?.MovingAvgPrice,
                HSNCode: element?.HSNCode,
                IsBatchNo: element?.IsBatchNo,
                IsSerialNo: element?.IsSerialNo,
                IsDeleted:element?.IsDeleted
              });
            });
            this.dataSource.data = this.productPlantMappingList;
          }
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  //API unit list
  apiUnitList() {
    this.unitService
      .getAllUnit().subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.unitList = res[ResultEnum.Model];
          this.filteredBaseUnit = this.searchBaseUOMControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUnit(value || ''))
          );
          this.filteredPurchaseUnit = this.searchPurchaseUOMControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUnit(value || ''))
          );
          this.filteredSalesUnit = this.searchSalesUOMControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUnit(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  //API product group list
  apiProductGroup() {
    this.productGroupService
      .getProductGroupList().subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productGroupList = res[ResultEnum.Model];
          this.filteredProductGroup = this.searchProductGroupControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProductGroup(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  //API plant list
  apiPlantList() {
    this.plantService
      .getPlantList()
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
          this.filteredPlant = this.searchPlantControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPlant(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });

  }

  //Search unit for dropdown
  filterUnit(name: any) {
    if (name?.UOM) {
      return this.unitList?.filter(role =>
        role?.UOM?.toLowerCase().includes(name.UOM.toLowerCase()));
    }
    else {
      return this.unitList?.filter(role =>
        role?.UOM?.toLowerCase().includes(name.toLowerCase()));
    }
  }
  //Search product group for dropdown
  filterProductGroup(name: any) {

    return this.productGroupList?.filter(productgroup =>
      productgroup?.ProductGroupName?.toLowerCase().includes(name.toLowerCase()) ||
      productgroup?.Description?.toLowerCase().includes(name.toLowerCase()));
  }

//Search price indicator for dropdown
  filterPriceIndicator(name: any) {
    return this.priceIndicator.filter(role =>
      role?.Name?.toLowerCase().includes(name.toLowerCase()) ||
      role?.Id?.toLowerCase().includes(name.toLowerCase()));
  }

  //Search plant dropdown
  filterPlant(name: any) {
    return this.plantList?.filter(productgroup =>
      productgroup?.PlantCode?.toLowerCase().includes(name.toLowerCase()) ||
      productgroup?.PlantName?.toLowerCase().includes(name.toLowerCase()));
  }

  //Funcation for allow only digit on key press event
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

  //Open modal popup for add plant
  openModelForAddPlant(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  //Add or Update plant
  addPlant() {
    this.productPlantForm.markAllAsTouched();
    if (!this.productPlantForm.valid)
      return;
    const plantDetails = this.productPlantForm.value as any;
    if (this.productPlantForm.value) {
      if (plantDetails?.Id > 0) {
        this.productPlantMappingList.forEach(element => {
          if (element?.SRNo == plantDetails?.Id) {
            element.PlantId = plantDetails?.Plant?.Id,
              element.PlantCode = plantDetails?.Plant?.PlantCode,
              element.PlantName = plantDetails?.Plant?.PlantName,
              element.PriceIndicator = plantDetails?.PriceIndicator?.Id,
              element.StandardPrice = plantDetails?.StandardPrice,
              element.MovingAvgPrice = plantDetails?.MovingAvgPrice,
              element.HSNCode = plantDetails?.HSNCode,
              element.IsBatchNo = plantDetails?.IsBatchNo,
              element.IsSerialNo = plantDetails?.IsSerialNo;
          }
        });
      }
      else {
        this.productPlantMappingList.push({
          SRNo: this.productPlantMappingList.length + 1,
          Id: 0,
          PlantId: plantDetails?.Plant?.Id,
          PlantCode: plantDetails?.Plant?.PlantCode,
          PlantName: plantDetails?.Plant?.PlantName,
          PriceIndicator: plantDetails?.PriceIndicator?.Id,
          StandardPrice: plantDetails?.StandardPrice,
          MovingAvgPrice: plantDetails?.MovingAvgPrice,
          HSNCode: plantDetails?.HSNCode,
          IsBatchNo: plantDetails?.IsBatchNo,
          IsSerialNo: plantDetails?.IsSerialNo,
        });
      }
    }
    this.dataSource.data = this.productPlantMappingList;
    this.productPlantForm.reset();
    this.isEdit = false;
    this.dialog.closeAll();
  }

  //Open modal poup for edit plant details and bind all the details in form
  editPlantDetials(templateRef: TemplateRef<any>,event: any) {
    this.isEdit = true;
    if (event) {
      this.productPlantForm.patchValue({
        Id: event?.SRNo,
        Plant: this.plantList.find(x => x.Id == event?.PlantId) as any,
        PriceIndicator: this.priceIndicator.find(x => x.Id == event?.PriceIndicator) as any,
        StandardPrice: event?.StandardPrice,
        MovingAvgPrice: event?.MovingAvgPrice,
        HSNCode: event?.HSNCode,
        IsBatchNo: event?.IsBatchNo,
        IsSerialNo: event?.IsSerialNo,
      });
    }
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  //Modal popup for delete alert
  openDeleteModel(templateRef: TemplateRef<any>, productId: number) {
    this.selectedProductId = productId;
    this.dialog.open(templateRef);
  }


  //Click event delete plant from line item
  onClickDeleteItem() {
    const index: number = this.productPlantMappingList.findIndex(x => x.Id == this.selectedProductId);
    if (index !== -1) {
      this.productPlantMappingList[index].IsDeleted=true;
    }
    this.dataSource.data = this.productPlantMappingList.filter(x=>x.IsDeleted==false);
    this.selectedProductId = 0;
    this.dialog.closeAll();
  }


//Click event APi product add
  onClickAddProduct() {
    const productData = this.productForm.value as any;
    this.productForm.markAllAsTouched();
    if (!this.productForm.valid)
      return;
    if (this.productPlantMappingList.length <= 0)
      throw this.toaster.error('Please add at least one plant for this product...');

    const product = {
      Id: this.productDetails.Id,
      ProductCode: this.productDetails.ProductCode,
      Description: productData.ProductDescription,
      ProductGroup: productData.ProductGroup?.ProductGroupName,
      BaseUnit: productData.BaseUnit?.UOM,
      PurchaseUnit: productData.PurchaseUnit?.UOM,
      SalesUnit: productData.SalesUnit?.UOM,
      GST: productData.GST,
      Height: productData?.Height,
      Width: productData?.Width,
      Length: productData.Length,
      Weight: productData.Weight,
      IsActive: this.productDetails.IsActive,
      ProductPlantMapping: this.productPlantMappingList
    } as Products;

    this.updateProductService(product);

  }

  //API update product
  updateProductService(product: any) {
    this.productService.updateProduct(product).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
          this.productForm.reset();
          this.selectedProductId = 0;
          this.router.navigateByUrl('/masters/product');
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

