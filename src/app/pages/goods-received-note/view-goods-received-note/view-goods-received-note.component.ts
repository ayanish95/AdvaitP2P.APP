import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { GoodsReceptionNotificationService } from '@core/services/goods-reception-notification.service';
import { GoodsReceivedNoteHeaderVM } from '@core/models/goods-received-note';


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
  GRNDetails!:GoodsReceivedNoteHeaderVM;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private grnService: GoodsReceptionNotificationService,private location: Location, private toaster: ToastrService, private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
    });
  }

  ngOnInit(): void {
    this.grnService
      .GetAllGRListForQC(this.PRId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.GRNDetails = res[ResultEnum.Model];
            this.dataSource.data = this.GRNDetails.GRNDetails;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }
  onClickBack() {
    this.location.back();
  }

}
