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
import {SelectionModel} from '@angular/cdk/collections';
@Component({
  selector: 'app-create-goods-received-note',
  templateUrl: './create-goods-received-note.component.html',
  styleUrls: ['./create-goods-received-note.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' }
    }
  ]
})
export class CreateGoodsReceivedNoteComponent implements OnInit {
  GRHeaderForm = this.fb.group({
    ASNNumber: ['', [Validators.required]],
    PONumber: ['', [Validators.required]],
    DocType: ['', [Validators.required]],
    Documentdate: [new Date(), [Validators.required]],
    StockType: ['', [Validators.required]],
    Transaction: ['', [Validators.required]],
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

  asnList!:AdvancedShipmentNotificationVM[];
  filteredASNo!: Observable<AdvancedShipmentNotificationVM[]>;

  dataSource = new MatTableDataSource<any>();
  packingdataSource = new MatTableDataSource<any>();
  index = 0;
  displayedColumns: string[] = [
    'IsSelected',
    'srNo',
    'ProductCode',
    'Description',
    'GRQty',
    'OpenGRQty',
    'Unit',
    'Plant',
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
    {"Id":StockTypeEnum.QualityCheck,"Value":StockTypeEnum.QualityCheck},
    {"Id":StockTypeEnum.UnrestrictedStock,"Value":StockTypeEnum.UnrestrictedStock},
    {"Id":StockTypeEnum.RestrictedStock,"Value":StockTypeEnum.RestrictedStock},
  ];

  minDate: Date = new Date();
  selectedLineId!: number;
  currentUserId!:number;
  ASNDetails!: AdvancedShipmentNotificationVM;
  GRNLineItems: GoodsReceivedNoteDetVM[] = [];
  filteredStockType!: Observable<any[]>;
  stockTypeControl = new FormControl();
  asnNumberControl = new FormControl();
  selection = new SelectionModel<GoodsReceivedNoteDetVM>(true, []);
  selectionSerialAndBatchNo = new SelectionModel<GoodsReceivedNoteProductDet>(true, []);
  constructor(private fb: FormBuilder, private dialog: MatDialog, private dateAdapter: DateAdapter<any>, private toaster: ToastrService, 
    private asnService: AdvanceShippingNotificationService,private router: Router, private route: ActivatedRoute,private authService:AuthService) {
    this.dateAdapter.setLocale('en-GB'); // DD/MM/YYYY
  }

  ngOnInit() {
    this.currentUserId = this.authService.userId();
    this.apiGetASNNumberForGR();

    this.filteredStockType = this.stockTypeControl!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStockType(value || ''))
    );
  }

  apiGetASNNumberForGR(){
    this.asnService.GetAllASNListForGRCreation().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.asnList = res[ResultEnum.Model];
          console.log('ASN List',this.asnList);
  
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
        this.packingdataSource.data.forEach(row => this.selection.select(row));
  }

  onLineChangeOpenGRQty(paramevent: any, paramIndex: number) {
    const _letNumber = Number(paramevent.target.value);
    let totalQty = this.GRNLineItems[paramIndex]?.TotalQty! ? this.GRNLineItems[paramIndex]?.TotalQty! : 0;
    //this.ASNLineItems[paramIndex].OpenGRQty = this.ASNLineItems[paramIndex].POQty;
    this.GRNLineItems[paramIndex].OpenGRQty = totalQty - _letNumber;
    this.GRNLineItems[paramIndex].DeliveryQty = _letNumber;

    this.dataSource.data = this.GRNLineItems;
  }

  onSelectChangeASNNumber(id:any){
    console.log('ASn NUmber',id);
    
    this.asnService
    .GetASNDetailsById(id).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          console.log('data',res[ResultEnum.Model]);
          this.ASNDetails = res[ResultEnum.Model];
          if(this.ASNDetails){
            this.GRHeaderForm.patchValue({
              DocType:this.ASNDetails?.DocType ? this.ASNDetails?.DocType : null,
              PONumber:this.ASNDetails?.ERPPONumber ? this.ASNDetails.ERPPONumber : null,
              Transaction : 'Inbound Delivery',
              StockType : StockTypeEnum.QualityCheck
            });
            this.ASNDetails.ASNDetails?.forEach((item, index) => {
              this.GRNLineItems.push({
                Id: 0,
                ASNDetId: item ? item?.Id : 0,
                ProductCode: item ? item?.ProductCode : '',
                ProductDescription: item ? item?.ProductDescription : '',
                POId: item ? item?.POId : 0,
                PODetId: item?.Id ? item?.PODetId : 0,
                // ProductId: item ? item?.ProductId : 0,
                ProductGroup: item ? item?.ProductGroup : '',
                DeliveryQty: item ? item?.DeliveryQty : 0,
                OpenGRQty: item ? item?.OpenGRQty : 0,
                TotalQty: (item?.DeliveryQty ? item?.DeliveryQty : 0) + item?.OpenGRQty,
                DeliveryDate: item.DeliveryDate,
                UnitName: item ? item?.UnitName : '',
                Plant: item ? item?.Plant : '',
                StorageLocation: item ? item?.StorageLocation : '',
                ASNHeaderId: item ? item?.ASNHeaderId : 0,
                StockType: item ? item?.StockType : '',
                IsBatchNo: item ? item?.IsBatchNo : false,
                IsSerialNo: item ? item?.IsSerialNo : false,
                GRNProductDetails: item ? item?.ASNProductDetails : [],
                IsSelected : false
              });
            });
            this.GRNLineItems.filter(x=>x.GRNProductDetails.filter(y=>y.IsSelected=true));
            this.dataSource.data = this.GRNLineItems;

          }
          else{
            this.toaster.error(res.Message);  
          }
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

  closeDialog(){
    this.dialog.closeAll();
  }

  onClickCreatePR() {
    this.GRHeaderForm.touched;
    if (this.GRHeaderForm.valid) {
      const PRHeaderData = this.GRHeaderForm.value;
      const PRDetails: GoodsReceivedNoteHeaderVM = {
        ASNNo: this.ASNDetails.ASNNo,
        ERPPONumber: this.ASNDetails.ERPPONumber ? this.ASNDetails.ERPPONumber : '',
        DocType: PRHeaderData.DocType ? PRHeaderData.DocType : '',
        GRNDetails: this.GRNLineItems
      };

      this.asnService.UpdateASNDetails(PRDetails).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.GRHeaderForm.reset();
            this.GRNLineForm.reset();
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
  
}
