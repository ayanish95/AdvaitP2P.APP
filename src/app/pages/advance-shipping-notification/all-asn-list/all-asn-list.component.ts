import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { AdvancedShipmentNotificationVM } from '@core/models/advance-shipping-notification';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseOrderHeader } from '@core/models/purchase-order';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-asn-list',
  templateUrl: './all-asn-list.component.html',
  styleUrls: ['./all-asn-list.component.scss']
})
export class AllAsnListComponent implements OnInit, OnChanges {
  @Input() allASNList!: AdvancedShipmentNotificationVM[];
  @Input() allPOList!: PurchaseOrderHeader[];
  @Input() Type!:string;
  @Output() LoadAllASN: EventEmitter<string> = new EventEmitter<string>();

  isLoading = true;
  asnDisplayedColumns: string[] = [
    'srNo',
    'ASNNo',
    'ASNDate',
    'PRNumber',
    'PRNumber',
    'PRDocType',
    'PRDate',
    // 'Delete',
    'View',
  ];
  displayedColumns: string[] = [
    'srNo',
    'PRNumber',
    'PRDocType',
    'PRDate',
    // 'Delete',
    'View',
  ];

  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  AsnList!: AdvancedShipmentNotificationVM[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;
  propChanges: any;

  constructor(private purchaseRequistionService: PurchaseRequistionService, private advanceShippingNotificationService: AdvanceShippingNotificationService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
    
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();

    if (this.allPOList?.length > 0 && this.Type=='PO') {
      this.AsnList = [];
      this.dataSource.data = this.allPOList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
    if (this.allASNList?.length > 0 && this.Type=='ASN') {
      this.allPOList=[];
      this.dataSource.data = this.allASNList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    this.propChanges = changes;
    if (this.propChanges?.allASNList && this.Type=='ASN') {
      this.allPOList=[];
      const currentValue = this.propChanges.allASNList?.currentValue;
      this.allASNList = currentValue;
      this.dataSource.data = this.allASNList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
    if (this.propChanges?.allPOList && this.Type=='PO') {
      this.AsnList = [];
      const currentValue = this.propChanges.allPOList?.currentValue;
      this.allPOList = currentValue;
      this.dataSource.data = this.allPOList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
  }

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPRId = plantId;
    this.dialog.open(templateRef);
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

  onClickDeleteASN() {
    if (this.selectedPRId == 0 || this.selectedPRId == undefined)
      throw this.toaster.error('Something went wrong');
    this.purchaseRequistionService
      .deletePR(this.selectedPRId, this.currentUserId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.LoadAllASN.emit();
          this.selectedPRId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }

}
