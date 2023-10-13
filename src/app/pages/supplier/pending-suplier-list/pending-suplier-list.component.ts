import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Suppliers } from '@core/models/suppliers';
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

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'SupplierName',
    'City',
    'Country',
    'Phone',
    'Edit'
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

  constructor(private supplierService: SupplierService, private toast: ToastrService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.allSuppliierList= this.supplierList;
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
    if(this.propChanges.supplierList){
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
            dialogRef.afterClosed().subscribe((result:any) => {
              debugger;
              if(result!='' && result !=undefined && result?.data){
             this.supplierService.approveSupplier(result?.data).subscribe({
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
}
