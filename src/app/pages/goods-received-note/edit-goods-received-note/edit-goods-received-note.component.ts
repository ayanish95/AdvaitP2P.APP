import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { AdvancedShipmentNotificationVM } from '@core/models/advance-shipping-notification';
import { StockTypeEnum } from '@core/enums/stokc-stype-enum';
import { GoodsReceivedNoteDetVM, GoodsReceivedNoteHeaderVM, GoodsReceivedNoteProductDet } from '@core/models/goods-received-note';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonEnum } from '@core/enums/common-enum';
import { GoodsReceptionNotificationService } from '@core/services/goods-reception-notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-goods-received-note',
  templateUrl: './edit-goods-received-note.component.html',
  styleUrls: ['./edit-goods-received-note.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' }
    }
  ]
})
export class EditGoodsReceivedNoteComponent implements OnInit {
  GRNHeaderForm = this.fb.group({
    Documentdate: [{ value: new Date(), disabled: true }, [Validators.required]],
    GRNNumber: [{ value: '', disabled: true }, [Validators.required]],
    ASNNumber: [{ value: '', disabled: true }, [Validators.required]],
    PONumber: [{ value: '', disabled: true }, [Validators.required]],
    DocType: [{ value: '', disabled: true }, [Validators.required]],
    ASNDeliveryDate: [{ value: null, disabled: true }, [Validators.required]],
    StockType: ['', [Validators.required]],
    Transaction: [{ value: '', disabled: true }, [Validators.required]],
    Supplier: [{ value: '', disabled: true }],
    CompanyCode: [{ value: '', disabled: true }],
  });

  GRNLineForm = this.fb.group({
    Product: ['', [Validators.required]],
    Description: [''],
    ProductGroup: [''],
    Qty: ['', [Validators.required]],
    Unit: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    Plant: ['', [Validators.required]],
    StorageLocation: ['', [Validators.required]],
  });

  asnList!: AdvancedShipmentNotificationVM[];
  filteredASNo!: Observable<AdvancedShipmentNotificationVM[]>;

  dataSource = new MatTableDataSource<any>();
  packingdataSource = new MatTableDataSource<any>();
  index = 0;
  displayedColumns: string[] = [
    // 'IsSelected',
    'srNo',
    'ProductCode',
    'Description',
    'GRQty',
    'OpenGRQty',
    'Unit',
    // 'Plant',
    'Location',
    'ViewPacking',
  ];
  displayedPackingColumns: string[] = [
    'IsSelected',
    'srNo',
    'Product',
    'BatchNo',
    'SerialNo',
    'Qty'
  ];

  stockTypeList = [
    { Id: StockTypeEnum.QualityCheck, Value: StockTypeEnum.QualityCheck },
    { Id: StockTypeEnum.UnrestrictedStock, Value: StockTypeEnum.UnrestrictedStock },
    { Id: StockTypeEnum.RestrictedStock, Value: StockTypeEnum.RestrictedStock },
  ];

  minDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!: number;
  //ASNDetails!: AdvancedShipmentNotificationVM;
  GRNLineItems: GoodsReceivedNoteDetVM[] = [];
  filteredStockType!: Observable<any[]>;
  stockTypeControl = new FormControl();
  asnNumberControl = new FormControl();
  selection = new SelectionModel<GoodsReceivedNoteDetVM>(true, []);
  selectionSerialAndBatchNo = new SelectionModel<GoodsReceivedNoteProductDet>(true, []);
  GRNDetails!: GoodsReceivedNoteHeaderVM;

  GRNId!: number;
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private toaster: ToastrService, private GRNService: GoodsReceptionNotificationService,
    private asnService: AdvanceShippingNotificationService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private location: Location,) {
    this.route.queryParams.subscribe((params: any) => {
      this.GRNId = params.id;
      if (!this.GRNId || this.GRNId <= 0)
        this.router.navigateByUrl('/pages/goods-received-note');
    });
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.currentUserId = this.authService.userId();
    this.apiGetASNNumberForGR();
    if (this.GRNId)
      this.apiGetASNDetailsById(this.GRNId)
    this.filteredStockType = this.stockTypeControl!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStockType(value || ''))
    );
  }

  apiGetASNNumberForGR() {
    this.asnService.GetAllASNListForGRCreation().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.asnList = res[ResultEnum.Model];

          this.filteredASNo = this.asnNumberControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterASNNumber(value || ''))
          );
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

  apiGetASNDetailsById(GRNId: number) {
    this.GRNService
      .GetGRNDetailsById(GRNId).subscribe({
        next: (res) => {
          if (res[ResultEnum.IsSuccess]) {
            if (res[ResultEnum.Model]) {
              this.GRNDetails = res[ResultEnum.Model];
              if (this.GRNDetails) {
                this.GRNHeaderForm.patchValue({
                  ASNDeliveryDate: this.formatDate(this.GRNDetails?.GRDeliveryDate) as any,
                  GRNNumber : this.GRNDetails.GRNo,
                  ASNNumber : this.GRNDetails.ASNNo,
                  DocType: this.GRNDetails?.DocType ? this.GRNDetails?.DocType : null,
                  PONumber: this.GRNDetails?.ERPPONumber ? this.GRNDetails.ERPPONumber : null,
                  CompanyCode: this.GRNDetails?.CompanyCode ? this.GRNDetails.CompanyCode : null,
                  Supplier: (this.GRNDetails?.Supplier ? this.GRNDetails.Supplier.SupplierCode : null) + ' - ' + (this.GRNDetails?.Supplier?.FirstName ? (this.GRNDetails?.Supplier?.FirstName + this.GRNDetails?.Supplier?.LastName) : null),
                  Transaction: this.GRNDetails.Transaction,
                  StockType: this.GRNDetails.StockType
                });
                this.GRNDetails.GRNDetails?.forEach((item, index) => {
                  this.GRNLineItems.push({
                    SRNo: index + 1,
                    Id: item.Id,
                    ASNDetId: item ? item?.Id : 0,
                    POId: item?.POId ? item?.POId : 0,
                    PODetId: item?.PODetId ? item?.PODetId : 0,
                    ProductId: item ? item?.ProductId : 0,
                    Product: item?.Product,
                    GRDeliveryQty: item ? item?.GRDeliveryQty : 0,
                    OpenGRQty: item?.PODetId ? item?.PODetId : 0,
                    TotalQty: (item?.GRDeliveryQty ? item?.GRDeliveryQty : 0) + (item?.OpenGRQty ? item?.OpenGRQty : 0),
                    DeliveryDate: item.DeliveryDate,
                    UnitId:item?.UnitId,
                    Unit:item?.Unit,
                    // UnitName: item ? item?.UnitName : '',
                    // Plant: item ? item?.Plant : '',
                    StorageLocationId: item?.StorageLocationId,
                    StorageLocation: item?.StorageLocation,
                    ASNHeaderId: item?.ASNHeaderId ? item?.ASNHeaderId : 0,
                    StockType: item?.StockType,
                    IsBatchNo: item ? item?.IsBatchNo : false,
                    IsSerialNo: item ? item?.IsSerialNo : false,
                    GRNProductDetails: item ? item?.GRNProductDetails : [],
                    IsSelected: true
                  });
                  if (item?.GRNProductDetails)
                    item?.GRNProductDetails.forEach(row => this.selectionSerialAndBatchNo.select(row));
                });
                this.GRNLineItems?.filter(x => x.GRNProductDetails?.filter(y => y.IsSelected = true));
                this.dataSource.data = this.GRNLineItems;
  
              }
              else {
                this.toaster.error(res.Message);
              }


              this.dataSource.data = this.GRNDetails.GRNDetails;
            }
            else
              this.toaster.error(res[ResultEnum.Message]);
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        },
        error: (e) => { this.toaster.error(e.Message);}
      });
  }

  filterASNNumber(name: any) {
    if (name?.ASNNo) {
      return this.asnList.filter(pr =>
        pr?.ASNNo?.toLowerCase().includes(name.ASNNo.toLowerCase()));

    }
    else {
      return this.asnList.filter(pr =>
        pr?.ASNNo?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterStockType(name: any) {
    return this.stockTypeList.filter(pr =>
      pr?.Value?.toLowerCase().includes(name.toLowerCase()));
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

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedSerialAndBatchNumber() {
    const numSelected = this.selectionSerialAndBatchNo.selected.length;
    const numRows = this.packingdataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSerialAndBatchNumber() {
    this.isAllSelectedSerialAndBatchNumber() ?
      this.selectionSerialAndBatchNo.clear() :
      this.packingdataSource.data.forEach(row => this.selectionSerialAndBatchNo.select(row));
  }

  onLineChangeOpenGRQty(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    const totalQty = this.GRNLineItems[paramIndex]?.TotalQty! ? this.GRNLineItems[paramIndex]?.TotalQty! : 0;
    //this.ASNLineItems[paramIndex].OpenGRQty = this.ASNLineItems[paramIndex].POQty;
    this.GRNLineItems[paramIndex].OpenGRQty = totalQty - _letNumber;
    this.GRNLineItems[paramIndex].GRDeliveryQty = _letNumber;

    this.dataSource.data = this.GRNLineItems;
  }


  openModelForViewItem(templateRef: TemplateRef<any>, data?: any) {
    // this.selectionSerialAndBatchNo.clear() ;
    const isSerialNo = data?.IsSerialNo;
    const isBatchNo = data?.IsBatchNo;
    // const isBatchNo = true;
    // const isSerialNo = false;

    const type = this.checkProductType(isSerialNo, isBatchNo);
    if (data?.DeliveryQty) {

      if (type != CommonEnum.None) {
        if (type != CommonEnum.BatchNo) {
          this.displayedPackingColumns = [
            'IsSelected',
            'srNo',
            'Product',
            'SerialNo',
            'Qty'
          ];
        }
        else {
          this.displayedPackingColumns = [
            'IsSelected',
            'srNo',
            'Product',
            'BatchNo',
            'Qty'
          ];
        }
        if (type == CommonEnum.All) {
          this.displayedPackingColumns = [
            'IsSelected',
            'srNo',
            'Product',
            'BatchNo',
            'SerialNo',
            'Qty'
          ];
        }

        // this.packingdataSource.data.forEach(row => this.selectionSerialAndBatchNo.select(row));
      }
    }
    this.packingdataSource.data = data?.GRNProductDetails;

    this.dialog.open(templateRef, {
      width: type == CommonEnum.All ? '56vw' : '45vw',
      panelClass: 'custom-modalbox'
    });
  }

  checkProductType(isSerialNo: any, isBatchNo: any) {
    if (isBatchNo && !isSerialNo)
      return CommonEnum.BatchNo;
    else if (!isBatchNo && isSerialNo)
      return CommonEnum.SerialNo;
    else if (isBatchNo && isSerialNo)
      return CommonEnum.All;
    else if (!isBatchNo && !isSerialNo)
      return CommonEnum.None;
    return CommonEnum.None;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onClickCreatePR() {

    // if (!this.selection.selected?.length)
    //   throw this.toaster.error('Please select at least one item...');
    // if (!this.selectionSerialAndBatchNo.selected?.length)
    //   throw this.toaster.error('Please select at least one serial number or batch number from view packing...');

    const selectedLine = this.selection.selected;
    const selectedLineProduct = this.selectionSerialAndBatchNo.selected;
    this.GRNHeaderForm.touched;
    if (this.GRNHeaderForm.valid) {
      this.GRNLineItems.forEach(lineItem => {
        if (selectedLine.filter(y => y.ASNDetId == lineItem.ASNDetId)?.length > 0) {
          lineItem.IsSelected = true;
        }
        else
          lineItem.IsSelected = false;

        lineItem.GRNProductDetails?.forEach(productItem => {
          if (selectedLineProduct.filter(y => y.Id == productItem.Id)?.length > 0) {
            productItem.IsSelected = true;
          }
          else {
            productItem.IsSelected = false;
          }
        });
      });

      const GRNHeaderData = this.GRNHeaderForm.value;
      const GRNDate = this.GRNHeaderForm.get('Documentdate')?.getRawValue();
      const GRNData: GoodsReceivedNoteHeaderVM = {
        Id:this.GRNId,
        POId: this.GRNDetails.POId,
        ASNId: this.GRNDetails.ASNId,
        ASNNo: this.GRNDetails.ASNNo,
        ERPPONumber: this.GRNDetails.ERPPONumber ? this.GRNDetails.ERPPONumber : '',
        DocType: GRNHeaderData.DocType ? GRNHeaderData.DocType : '',
        Transaction: GRNHeaderData.Transaction ? GRNHeaderData.Transaction : '',
        StockType: GRNHeaderData.StockType ? GRNHeaderData.StockType : '',
        GRDeliveryDate: GRNDate ? GRNDate : new Date(),
        GRNDetails: this.GRNLineItems
      };


      this.GRNService.UpdateGR(GRNData).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.GRNHeaderForm.reset();
            this.GRNLineForm.reset();
            this.router.navigateByUrl('/pages/goods-received-note');
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
