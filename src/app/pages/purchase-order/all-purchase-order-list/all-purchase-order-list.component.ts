import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { ApprovalStrategy } from '@core/models/approval-type';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseOrderHeader } from '@core/models/purchase-order';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-purchase-order-list',
  templateUrl: './all-purchase-order-list.component.html',
  styleUrls: ['./all-purchase-order-list.component.scss']
})
export class AllPurchaseOrderListComponent implements OnInit {
  @Input() allPOHeaderList!: PurchaseOrderHeader[];
  @Input() ApprovalStrategyList!: ApprovalStrategy[];
  @Output() LoadAllPO: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = [
    'srNo',
    'PONumber',
    'PODate',
    'PRNumber',
    'DocType',
    'Supplier',
    'TotalPOAmount',
    'PRPendingBy',
    'Approved',
    'Edit',
    'Delete',
    'View',
    'AddASN',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
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
  selectedPOId!: number;

  constructor(private purchaseOrderService:PurchaseOrderService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog, private strategyService: ApprovalStrategyService) { }

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
   
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPPRNumber' && x != 'SAPStatus');

      if (this.allPOHeaderList?.length > 0) {
        this.dataSource.data = this.allPOHeaderList;
        this.dataSource.paginator = this.paginator;
        this.filter = new Filter();
        this.filter.OrderBy = OrderBy.DESC;
        this.filter.OrderByColumn = 'id';
        this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.propChanges = changes;
    if (this.propChanges.allPOHeaderList) {
      const currentValue = this.propChanges.allPOHeaderList?.currentValue;
      this.allPOHeaderList = currentValue;
      this.dataSource.data = this.allPOHeaderList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
    if (this.propChanges?.ApprovalStrategyList) {
      const currentValue = this.propChanges.ApprovalStrategyList?.currentValue;
      this.ApprovalStrategyList = currentValue;
    }
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

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPOId = plantId;
    this.dialog.open(templateRef);
  }

  onClickDeletePO(){
    if (this.selectedPOId == 0 || this.selectedPOId == undefined)
    throw this.toaster.error('Something went wrong');
  this.purchaseOrderService
    .deletePO(this.selectedPOId)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.toaster.success(res[ResultEnum.Message]);
        this.LoadAllPO.emit();
        this.selectedPOId = 0;
      }
      else
        this.toaster.error(res[ResultEnum.Message]);

      this.dialog.closeAll();
    });
  }
}
