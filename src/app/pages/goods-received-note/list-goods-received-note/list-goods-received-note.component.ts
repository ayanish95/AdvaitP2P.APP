import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { PlantService } from '@core/services/plant.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-list-goods-received-note',
  templateUrl: './list-goods-received-note.component.html',
  styleUrls: ['./list-goods-received-note.component.scss']
})
export class ListGoodsReceivedNoteComponent {
  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'PRNumber',
    'PRDocType',
    'PRDate',
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

  constructor(private purchaseRequistionService:PurchaseRequistionService,private toaster:ToastrService) {}

  ngOnInit() {
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
}
