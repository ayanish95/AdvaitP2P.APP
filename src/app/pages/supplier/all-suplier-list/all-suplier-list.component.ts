import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AddSupplierForAdminComponent } from '../add-supplier-for-admin/add-supplier-for-admin.component';
import { Role } from '@core/enums/role';
import { AuthService } from '@core/authentication/auth.service';

@Component({
  selector: 'app-all-suplier-list',
  templateUrl: './all-suplier-list.component.html',
  styleUrls: ['./all-suplier-list.component.scss']
})
export class AllSuplierListComponent implements OnInit, OnChanges {

  @Input() searchText!: string;
  @Input() supplierList!: Suppliers[];
  @Output() APICallAllSupplierList: EventEmitter<string> = new EventEmitter<string>();
  propChanges: any;

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'SupplierCode',
    'ERPSupplierCode',
    'SupplierName',
    // 'SapUserId',
    // 'AccountGroup',
    'City',
    'Country',
    'Phone',
    'Approved',
    'Edit',
    'Delete'
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
  selectedSupplierId = 0;
  currentUserRole!: number;
  Role = Role;
  isSAPEnabled!: string;

  constructor(private supplierService: SupplierService, private toast: ToastrService, private dialog: MatDialog, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.roles();
    this.isSAPEnabled = this.authService.isSAPEnable();
    if (this.currentUserRole !== Role.Admin) {
      this.displayedColumns = this.displayedColumns.filter(x => x != 'Edit' && x != 'Delete');
    }
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPSupplierCode');
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

  openEditModelPopup(supplierId: number) {

    const dialogRef = this.dialog.open(AddSupplierForAdminComponent, {
      width: '60vw',
      panelClass: 'custom-modalbox',
      data: { supplierId: supplierId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.APICallAllSupplierList.emit();
    });
  }

  openDeleteModel(templateRef: TemplateRef<any>, supplierId: number) {
    this.selectedSupplierId = supplierId;
    this.dialog.open(templateRef);
  }

  onClickDeleteSupplier() {
    if (this.selectedSupplierId == 0 || this.selectedSupplierId == undefined)
      throw this.toast.error('Something went wrong');
    this.supplierService
      .deleteSupplier(this.selectedSupplierId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toast.success(res[ResultEnum.Message]);
          this.APICallAllSupplierList.emit();
          this.selectedSupplierId = 0;
        }
        else
          this.toast.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
