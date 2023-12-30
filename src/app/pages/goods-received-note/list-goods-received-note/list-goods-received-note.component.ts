import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { GoodsReceivedNoteHeaderVM } from '@core/models/goods-received-note';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { GoodsReceptionNotificationService } from '@core/services/goods-reception-notification.service';
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
    'GRNo',
    'GRDeliveryDate',
    'ASNNumber',
    'PRDocType',
    'ASNDate',
    'Supplier',
    'Actions',
    // 'View',
    // 'Delete'
  ];

  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  PRHeaderList!: PurchaseRequisitionHeader[];
  GRHeaderList!: GoodsReceivedNoteHeaderVM[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  selectedGRId!: number;
  filter: Filter = new Filter();
  index = 0;

  constructor(private grnService: GoodsReceptionNotificationService, private toaster: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.apiLoadAllGRNList();
  }

  apiLoadAllGRNList() {
    this.grnService
      .GetAllGRList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.GRHeaderList = res[ResultEnum.Model];
          this.dataSource.data = this.GRHeaderList;
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
    this.selectedGRId = plantId;
    this.dialog.open(templateRef);
  }

  onClickDelete() {
    if (this.selectedGRId == 0 || this.selectedGRId == undefined)
      throw this.toaster.error('Something went wrong');
    this.grnService
      .DeleteGRById(this.selectedGRId)
      .subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res[ResultEnum.Message]);
            this.apiLoadAllGRNList();
            this.selectedGRId = 0;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);

          this.dialog.closeAll();
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() {

        },
      });
  }
}
