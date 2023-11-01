import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { finalize } from 'rxjs';

@Component({
  selector: 'app-purchase-requisition-list',
  templateUrl: './purchase-requisition-list.component.html',
  styleUrls: ['./purchase-requisition-list.component.scss']
})
export class PurchaseRequisitionListComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'PRNumber',
    'ERPPRNumber',
    'PRDocType',
    'PRDate',
    'SAPStatus',
    'Edit',
    'Delete',
    'View',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  PRHeaderList!: PurchaseRequisitionHeader[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!:number;
  constructor(private purchaseRequistionService: PurchaseRequistionService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog,) { }

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    if (this.currentUserRole !== Role.Admin)
      this.displayedColumns = this.displayedColumns.filter(x => x != 'Edit' && x != 'Delete');
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPPRNumber');
    this.apiPRList();
  }

  apiPRList() {
    this.purchaseRequistionService
      .getAllPRHeaderList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.PRHeaderList = res[ResultEnum.Model];
          this.dataSource.data = this.PRHeaderList;
          this.dataSource.paginator = this.paginator;
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
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
      .deletePR(this.selectedPRId,this.currentUserId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiPRList();
          this.selectedPRId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
