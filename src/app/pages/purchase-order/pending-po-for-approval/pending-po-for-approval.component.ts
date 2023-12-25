import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pending-po-for-approval',
  templateUrl: './pending-po-for-approval.component.html',
  styleUrls: ['./pending-po-for-approval.component.scss']
})
export class PendingPOForApprovalComponent implements OnInit {

  @Input() PendingPOHeaderList!: PurchaseOrderVM[];
  @Output() LoadPendingPO: EventEmitter<string> = new EventEmitter<string>();

  displayedColumns: string[] = [
    'srNo',
    'PONumber',
    'PODate',
    // 'PRNumber',
    'DocType',
    'Supplier',
    'TotalPOAmount',
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
  selectedPOId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  dataSource = new MatTableDataSource<any>();
  currentPage = 1;
  pageSize = 10;
  propChanges: any;

  constructor(private dialog: MatDialog, private toaster: ToastrService, private authService: AuthService, private poService: PurchaseOrderService,) {

  }


  ngOnInit(): void {
    if (this.PendingPOHeaderList?.length > 0) {
      this.dataSource.data = this.PendingPOHeaderList;
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
      this.displayedColumns = this.displayedColumns.filter(x => x != 'Delete');
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPPRNumber' && x != 'SAPStatus');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.propChanges = changes;
    if (this.propChanges.PendingPOHeaderList) {
      const currentValue = this.propChanges.PendingPOHeaderList?.currentValue;
      this.PendingPOHeaderList = currentValue;
      this.dataSource.data = this.PendingPOHeaderList;
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
    this.selectedPOId = plantId;
    this.dialog.open(templateRef);
  }

  openApproveOrRejectPRModel(templateRef: TemplateRef<any>, PrId: number) {
    this.selectedPOId = PrId;
    this.dialog.open(templateRef);
  }

  onClickApprovePR() {
    if (!this.selectedPOId)
      throw this.toaster.error('Something went wrong');

    this.poService.approvePOById(this.selectedPOId).subscribe({
      next: (res: any) => {
        this.LoadPendingPO.emit();
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
    if (!this.selectedPOId)
      throw this.toaster.error('Something went wrong');

    this.poService.rejectPOById(this.selectedPOId).subscribe({
      next: (res: any) => {
        this.LoadPendingPO.emit();
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

  onClickDeletePO() {
    if (this.selectedPOId == 0 || this.selectedPOId == undefined)
      throw this.toaster.error('Something went wrong');
    this.poService
      .deletePO(this.selectedPOId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.LoadPendingPO.emit();
          this.selectedPOId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
