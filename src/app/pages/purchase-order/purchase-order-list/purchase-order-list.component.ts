import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { PurchaseOrderHeader } from '@core/models/purchase-order';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { PlantService } from '@core/services/plant.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent {

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'PONumber',
    'PODate',
    'PRNumber',
    'DocType',
    'Supplier',
    'TotalPOAmount',
    'View',
  ];
  
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  POHeaderList!: PurchaseOrderHeader[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;

  constructor(private purchaseOrderService:PurchaseOrderService,private toaster:ToastrService) {}

  ngOnInit() {
    this.purchaseOrderService
      .getAllPOHeaderListByUserId()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.POHeaderList = res[ResultEnum.Model];
          this.dataSource.data = this.POHeaderList;
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
}