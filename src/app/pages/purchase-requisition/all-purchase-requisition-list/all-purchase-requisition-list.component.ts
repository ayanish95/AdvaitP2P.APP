import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ApprovalTypeEnum } from '@core/enums/approval-type-enum';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { ApprovalStrategy } from '@core/models/approval-type';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-purchase-requisition-list',
  templateUrl: './all-purchase-requisition-list.component.html',
  styleUrls: ['./all-purchase-requisition-list.component.scss']
})
export class AllPurchaseRequisitionListComponent implements OnInit,OnChanges {
  @Input() allPRHeaderList!: PurchaseRequisitionHeader[];
  @Input() ApprovalStrategyList!: ApprovalStrategy[];
  @Output() LoadAllPR: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = [
    'srNo',
    'PRNumber',
    // 'ERPPRNumber',
    'PRDocType',
    'PRDate',
    'SAPStatus',
    'PRPendingBy',
    'Approved',
    'Edit',
    'Delete',
    'View'
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
  constructor(private purchaseRequistionService: PurchaseRequistionService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog, private strategyService: ApprovalStrategyService) { }

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
   
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'SAPStatus');

      if (this.allPRHeaderList?.length > 0) {
        this.dataSource.data = this.allPRHeaderList;
        this.dataSource.paginator = this.paginator;
        this.filter = new Filter();
        this.filter.OrderBy = OrderBy.DESC;
        this.filter.OrderByColumn = 'id';
        this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.propChanges = changes;
    if (this.propChanges.allPRHeaderList) {
      const currentValue = this.propChanges.allPRHeaderList?.currentValue;
      this.allPRHeaderList = currentValue;
      this.dataSource.data = this.allPRHeaderList;
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

  // api for get all list who have rights for approve supplier and based on that show approve and reject button
  apiApprovalStrategyByApprovalType() {
    this.strategyService
      .getApprovalStrategyByApprovalType(ApprovalTypeEnum.PR)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.ApprovalStrategyList = res[ResultEnum.Model];
          // Condition - Here is the check the current user have rights for approve the supplier, If yes then it've show the approve and reject button otherwise it will disappear for the user
          if (this.currentUserRole != Role.Admin)
            this.rightsForApproval = this.ApprovalStrategyList.filter(x => x.UserId == this.currentUserId)?.length > 0 ? true : false;
          else
            this.rightsForApproval = true;
          // if (!this.rightsForApproval && this.currentUserRole !== Role.Admin)
          //   this.displayedColumns = this.displayedColumns.filter(x => x != 'Edit' && x != 'Reject');
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
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

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPRId = plantId;
    this.dialog.open(templateRef);
  }

  onClickDeletePR() {
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
          this.LoadAllPR.emit();
          this.selectedPRId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }

}
