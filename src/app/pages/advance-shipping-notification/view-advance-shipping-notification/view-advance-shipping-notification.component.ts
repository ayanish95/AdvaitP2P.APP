import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { AdvancedShipmentNotificationVM } from './../../../core/models/advance-shipping-notification';

@Component({
  selector: 'app-view-advance-shipping-notification',
  templateUrl: './view-advance-shipping-notification.component.html',
  styleUrls: ['./view-advance-shipping-notification.component.scss']
})
export class ViewAdvanceShippingNotificationComponent {
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
  ASNId!: number;
  ASNDetails!: AdvancedShipmentNotificationVM;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private ASNService: AdvanceShippingNotificationService, private toaster: ToastrService, private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.ASNId = params.id;
    });
  }

  ngOnInit(): void {
    this.ASNService
      .GetASNDetailsById(this.ASNId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.ASNDetails = res[ResultEnum.Model];
            this.dataSource.data = this.ASNDetails.ASNDetails;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

}
