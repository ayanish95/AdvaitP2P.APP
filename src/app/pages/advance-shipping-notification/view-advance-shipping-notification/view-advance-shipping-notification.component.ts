import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AdvanceShippingNotificationService } from '@core/services/advance-shipment-notification.service';
import { AdvancedShipmentNotificationVM } from './../../../core/models/advance-shipping-notification';
import { MatDialog } from '@angular/material/dialog';
import { CommonEnum } from '@core/enums/common-enum';

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
    'View',
    // 'Close',
    // 'RFQ',
  ];

  displayedPackingColumns: string[] = [
    'srNo',
    'BatchNo',
    'SerialNo',
    'Qty'    
  ];
  ASNId!: number;
  ASNDetails!: AdvancedShipmentNotificationVM;
  dataSource = new MatTableDataSource<any>();
  packingdataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private ASNService: AdvanceShippingNotificationService, private toaster: ToastrService, private route: ActivatedRoute,private dialog: MatDialog) {

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

  async openModelForViewItem(templateRef: TemplateRef<any>,data?: any) {
    //this.selecteItemQty = 0;
    const isSerialNo = data?.IsSerialNo;
    const isBatchNo = data?.IsBatchNo;
   
    const type = this.checkProductType(isSerialNo, isBatchNo);
    if (data?.Qty) {
      // this.selecteItemQty = data.Qty;
      // this.selectePOLineId = data?.POLineId;
      // this.selectePOId = data?.POHeaderId;
      // if (!this.selectePOId || !this.selectePOLineId)
      //   throw this.toaster.error('PO Id or PO Line Id not found for selected row...');
      if (type != CommonEnum.None) {
        if (type != CommonEnum.BatchNo) {
          for (let index = 0; index < data?.Qty; index++) {
            //this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(type, this.selectePOId, this.selectePOLineId));
          }
        }
        else {
          //this.batchAndSerialNoGroupForm().push(this.createFormForBatchAndSerialNo(type, this.selectePOId, this.selectePOLineId));
        }
      }
    }

    this.dialog.open(templateRef, {
      width: type == CommonEnum.All ? '56vw' : '45vw',
      panelClass: 'custom-modalbox'
    });
  }

  checkProductType(isSerialNo: any, isBatchNo: any) {
    if (isBatchNo && !isSerialNo)
      return CommonEnum.BatchNo;
    else if (!isBatchNo && isSerialNo)
      return CommonEnum.SerialNo;
    else if (isBatchNo && isSerialNo)
      return CommonEnum.All;
    else if (!isBatchNo && !isSerialNo)
      return CommonEnum.None;
    return CommonEnum.None;
  }

}
