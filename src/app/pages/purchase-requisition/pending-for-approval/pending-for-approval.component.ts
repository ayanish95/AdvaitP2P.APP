import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-for-approval',
  templateUrl: './pending-for-approval.component.html',
  styleUrls: ['./pending-for-approval.component.scss']
})
export class PendingForApprovalComponent implements OnInit, OnChanges {

  @Input() pendingPRHeaderList!: PurchaseRequisitionHeader[];
  @Output() LoadPendingPR: EventEmitter<string> = new EventEmitter<string>();

  displayedColumns: string[] = [
    'srNo',
    'PRNumber',
    'ERPPRNumber',
    'PRDocType',
    'PRDate',
    'SAPStatus',
    'Edit',
    'Delete',
    'Approve',
    'Reject'
  ];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  dataSource = new MatTableDataSource<any>();
  currentPage = 1;
  pageSize = 10;
  propChanges: any;

  constructor(private dialog: MatDialog, private toaster: ToastrService, private authService: AuthService, private prService: PurchaseRequistionService,) {

  }


  ngOnInit(): void {
    if (this.pendingPRHeaderList?.length > 0) {
      this.dataSource.data = this.pendingPRHeaderList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    if (this.currentUserRole !== Role.Admin)
      this.displayedColumns = this.displayedColumns.filter(x =>x != 'Delete');
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPPRNumber' && x !='SAPStatus');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.propChanges = changes;
    if (this.propChanges.pendingPRHeaderList) {
      const currentValue = this.propChanges.pendingPRHeaderList?.currentValue;
      this.pendingPRHeaderList = currentValue;
      this.dataSource.data = this.pendingPRHeaderList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
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
    this.selectedPRId = plantId;
    this.dialog.open(templateRef);
  }

  openApproveOrRejectPRModel(templateRef: TemplateRef<any>, PrId: number) {
    this.selectedPRId = PrId;
    this.dialog.open(templateRef);
  }

  onClickApprovePR() {
    if (!this.selectedPRId)
      throw this.toaster.error('Something went wrong');

    this.prService.approvePRById(this.selectedPRId).subscribe({
      next: (res: any) => {
        this.LoadPendingPR.emit();
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
          this.dialog.closeAll();
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

  onClickRejectPR() {
    if (!this.selectedPRId)
      throw this.toaster.error('Something went wrong');

    this.prService.rejectPRById(this.selectedPRId).subscribe({
      next: (res: any) => {
        this.LoadPendingPR.emit();
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
          this.dialog.closeAll();
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
