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
import { Suppliers } from '@core/models/suppliers';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { SupplierService } from '@core/services/supplier.service';
import { ApproveSupplierComponent } from '@shared/dialog/approve-supplier/approve-supplier.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pending-suplier-list',
  templateUrl: './pending-suplier-list.component.html',
  styleUrls: ['./pending-suplier-list.component.scss']
})
export class PendingSuplierListComponent implements OnInit, OnChanges {

  @Input() searchText!: string;
  @Input() supplierList!: Suppliers[];
  propChanges: any;
  rejectComments!: string;

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'SupplierCode',
    'SupplierName',
    'City',
    'Country',
    'Phone',
    'PendingFrom',
    'Edit',
    'Reject',
    'View',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  allSuppliierList!: Suppliers[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  selectedSupplierId!: number;
  approvalStrategyList!: ApprovalStrategy[];
  currentUserId!: number;
  rightsForApproval = false;
  userRole!: number;
  Role = Role;
  @Output() APICallPendingSupplierList: EventEmitter<string> = new EventEmitter<string>();
  constructor(private supplierService: SupplierService, private toast: ToastrService, public dialog: MatDialog, private strategyService: ApprovalStrategyService,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    this.userRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.apiApprovalStrategyByApprovalType();
    this.allSuppliierList = this.supplierList;
    this.dataSource.data = this.allSuppliierList;
    this.dataSource.paginator = this.paginator;
    this.filter = new Filter();
    this.filter.OrderBy = OrderBy.DESC;
    this.filter.OrderByColumn = 'id';
    this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;

  }

  ngOnChanges(changes: SimpleChanges) {
    this.propChanges = changes;
    if (this.propChanges.searchText) {
      const currentValue = this.propChanges.searchText?.currentValue;
      if (currentValue != undefined)
        this.searchSupplier(currentValue);
    }
    if (this.propChanges.supplierList) {
      const currentValue = this.propChanges.supplierList?.currentValue;
      this.allSuppliierList = currentValue;
      this.dataSource.data = this.allSuppliierList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
    this.allSuppliierList;
  }

  // api for get all list who have rights for approve supplier and based on that show approve and reject button
  apiApprovalStrategyByApprovalType() {
    this.strategyService
      .getApprovalStrategyByApprovalType(ApprovalTypeEnum.Supplier)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approvalStrategyList = res[ResultEnum.Model];

          // Condition - Here is the check the current user have rights for approve the supplier, If yes then it've show the approve and reject button otherwise it will disappear for the user
          if (this.userRole != Role.Admin)
            this.rightsForApproval = this.approvalStrategyList.filter(x => x.UserId == this.currentUserId)?.length > 0 ? true : false;
          else
            this.rightsForApproval = true;
          if (!this.rightsForApproval && this.userRole !== Role.Admin)
            this.displayedColumns = this.displayedColumns.filter(x => x != 'Edit' && x != 'Reject');
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }

  searchSupplier(filterValue: any) {
    filterValue = filterValue;
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
  openDialog(event: any) {
    this.supplierService.getSupplierDetailById(event.Id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          const supplierDetails = res[ResultEnum.Model];
          if (supplierDetails) {
            const dialogRef = this.dialog.open(ApproveSupplierComponent, {
              width: '600px',
              data: { supplier: supplierDetails },
            });
            dialogRef.afterClosed().subscribe((result: any) => {
              if (result != '' && result != undefined && result?.data) {
                this.supplierService.approveSupplier(result?.data, this.userRole).subscribe({
                  next: (res: any) => {
                    if (res[ResultEnum.IsSuccess]) {
                      this.toast.success(res.Message);
                      this.allSuppliierList = res[ResultEnum.Model];
                      this.dataSource.data = res[ResultEnum.Model];
                    }
                    else {
                      this.toast.error(res.Message);
                    }
                  },
                  error: (e) => { this.toast.error(e.Message); },
                  complete() {

                  },
                });
              }
            });
          }
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }

  openDialogReject(templateRef: TemplateRef<any>, event: any) {
    this.rejectComments = '';
    this.selectedSupplierId = event.Id;
    this.dialog.open(templateRef);
  }

  onClickReject() {
    if (!this.rejectComments)
      throw this.toast.error('Please enter remarks for reject...');
    if (this.selectedSupplierId == 0 || this.selectedSupplierId == undefined)
      throw this.toast.error('Something went wrong');
    this.supplierService
      .rejectSupplier(this.selectedSupplierId, this.rejectComments)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toast.success(res[ResultEnum.Message]);
          this.APICallPendingSupplierList.emit();
          this.selectedSupplierId = 0;
        }
        else
          this.toast.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
