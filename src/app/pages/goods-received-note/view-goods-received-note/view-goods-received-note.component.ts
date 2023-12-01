import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { CommonEnum } from '@core/enums/common-enum';

import { GoodsReceptionNotificationService } from '@core/services/goods-reception-notification.service';
import { GoodsReceivedNoteHeaderVM } from '@core/models/goods-received-note';
import { MatDialog } from '@angular/material/dialog';


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
    'Plant',
    'Location',
    'View'
    // 'Close',
    // 'RFQ',
  ];
  PRId!: number;
  displayedPackingColumns!:string[];

  GRNDetails!:GoodsReceivedNoteHeaderVM;
  dataSource = new MatTableDataSource<any>();
  packingdataSource = new MatTableDataSource<any>();

  index = 0;
  constructor(private grnService: GoodsReceptionNotificationService,private location: Location, private toaster: ToastrService,private dialog: MatDialog, private route: ActivatedRoute) {

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
            console.log(this.GRNDetails)
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
  async openModelForViewItem(templateRef: TemplateRef<any>,data?: any) {
    //const isSerialNo = data?.IsSerialNo;
    //const isBatchNo = data?.IsBatchNo;
    const isBatchNo = true;
    const isSerialNo = true;

    const type = this.checkProductType(isSerialNo, isBatchNo);
    if (data?.GRNProductDetails) {

      if (type != CommonEnum.None) {
        if (type != CommonEnum.BatchNo) {
          this.displayedPackingColumns = [
            'srNo',
            'Product',
            'SerialNo',
            'Qty'
          ];
        }
        else {
          this.displayedPackingColumns = [
            'srNo',
            'Product',
            'BatchNo',
            'Qty'
          ];
        }
        if(type == CommonEnum.All){
          this.displayedPackingColumns = [
            'srNo',
            'Product',
            'BatchNo',
            'SerialNo',
            'Qty'
          ];
        }
        this.packingdataSource.data = data?.GRNProductDetails;
        console.log(data.GRNProductDetails)
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
  closeDialog(){
    this.dialog.closeAll();
  }

}
