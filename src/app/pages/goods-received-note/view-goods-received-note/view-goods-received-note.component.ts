import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { PurchaseRequisitionDataVM, PurchaseRequisitionDetailsVM } from '@core/models/purchase-requistion';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-view-goods-received-note',
  templateUrl: './view-goods-received-note.component.html',
  styleUrls: ['./view-goods-received-note.component.scss']
})
export class ViewGoodsReceivedNoteComponent {
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'ProductGroup',
    'Qty',
    'Unit',
    'DeliveryDate',
    'Plant',
    'Location',
    // 'Close',
    // 'RFQ',
  ];
  PRId!: number;
  PRDetails!: PurchaseRequisitionDetailsVM;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private PRService: PurchaseRequistionService, private toaster: ToastrService, private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
    });
  }

  ngOnInit(): void {
    this.PRService
      .getPRDetailsById(this.PRId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.PRDetails = res[ResultEnum.Model];
            this.dataSource.data = this.PRDetails.PRLineItems;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

}
