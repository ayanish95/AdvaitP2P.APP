import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { PurchaseOrderDetailsVM } from '@core/models/purchase-order';
import { PurchaseRequisitionDataVM, PurchaseRequisitionDetailsVM } from '@core/models/purchase-requistion';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import template from '@core/purchaseordertemplate';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.scss']
})
export class ViewPurchaseOrderComponent {

  public isPrint: boolean = false;
  public fromOpenSales: boolean = false;


  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'ProductGroup',
    'Qty',
    'Unit',
    'DeliveryDate',
    'Plant',
    'Location',
    'Close',
    'RFQ',
  ];
  PRId!: number;
  PODetails!: PurchaseOrderDetailsVM;
  PRDetails!: PurchaseRequisitionDetailsVM;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private PRService: PurchaseRequistionService, private POService: PurchaseOrderService, private toaster: ToastrService, private route: ActivatedRoute) {

  constructor(private PRService: PurchaseRequistionService,    private router: Router,
     private toaster: ToastrService, private route: ActivatedRoute) {

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


      this.POService
      .getPODetailsById(this.PRId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.PODetails = res[ResultEnum.Model];
            this.dataSource.data = this.PODetails.POLineItems;
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }
  print() {
    debugger
    let mergefile = "";
    let orderRow = "";
    let totalRow = "";
    let grandTable = "";
    let totalQty = 0;
    let totalRs = 0;
    let totalEKU = 0;
    let orderId = '';
    let OrderDate = "";
    let custName = "";
    let name = "";
    let custNum = "";
    let city = "";
    let orderBy = "";
    let remarks = "";
    let address = "";
    let j = 0;
    let pagecount = 1;
    let PRLineItems = [];
    if(this.dataSource.data.length == 0){
    }
    for (let i = 0; i < this.dataSource.data.length; i++) {
      PRLineItems.push(this.dataSource.data[i]);
    }
    let lastPage = Math.ceil(PRLineItems.length / 25);
    for (let i = 0; i < PRLineItems.length; i++) {
      let file = template.toString();

      if (j == 26) {
        j = 1;
        orderRow = "";
        pagecount++
      }
      custName = PRLineItems[0].ProductCode;
      orderId = PRLineItems[0].ProductDescription;
      custNum = PRLineItems[0].Id;
      city = PRLineItems[0].DeliveryDate;
      orderBy = PRLineItems[0].UnitDescription;
      remarks = PRLineItems[0].PlantCode;
      if (remarks == null) {
        remarks = "";
      }
      address = name +", " +PRLineItems[0].ProductCode;
      totalQty = totalQty + PRLineItems[i].ProductCode;
      totalRs = totalRs + PRLineItems[i].ProductCode;

      totalEKU = totalEKU + (PRLineItems[i].EKU * PRLineItems[i].ProductCode);
      orderRow += "<tr>";
      orderRow += "<td>" + (1 + i) + "</td>";
      orderRow += "<td>" + PRLineItems[i].PRId + " - " + PRLineItems[i].ProductGroup + " - " + PRLineItems[i].Description + "</td>";
      orderRow += "<td>" + PRLineItems[i].Quantity + "</td>";
      orderRow += "<td>" + (PRLineItems[i].Id).toFixed(2) + "</td>";
      // orderRow += "<td>" + (PRLineItems[i].Description).toFixed(2) + "</td>";
      // orderRow += "<td>" + (PRLineItems[i].EKU).toFixed(2) + "</td>";
      orderRow += "<td>" + (PRLineItems[i].EKU * PRLineItems[i].Description).toFixed(2) + "</td>";
      orderRow += "</tr>";
      // if (lastPage == pagecount) {
      //   // totalRow = "<tr><td colspan='2' style='text-align: left'><b>Total :</b></td><td>" + totalQty.toFixed(2) + "</td><td></td><td>" + totalRs.toFixed(2) + "</td><td></td><td>" + totalEKU.toFixed(2) + "</td>";
      //   grandTable = '<table class="table" style="width: 100%; margin-top:10px"><tr><td rowspan="3">For: Symphony Limited</td><td><b>Grand Total Value in Rs : ##GTotal</b></td></tr><tr>' +
      //     '<td>Grand Total (in words): ##GTotal</td></tr></table>';
      // }
      file = file.replace(/(\r\n|\n|\r)/gm, "");
      file = file.replace("##PAGE", "#" + pagecount + " of " + lastPage);
      file = file.replace("##OrderNumber", orderId);
      file = file.replace("##OrderDate", OrderDate)
      file = file.replace("##CustName", custName);
      file = file.replace("##ORDERITEM", orderRow);
      file = file.replace("##CustNum", custNum);
      file = file.replace("##CITY", city);
      file = file.replace("##ORDERBY", orderBy);
      file = file.replace("##REMARKS", remarks);
      file = file.replace("##ADDRESS", address);
      if (pagecount == 1 || lastPage == pagecount) {
        file = file.replace("##PIXAL", '10px');
      }
      else {
        file = file.replace("##PIXAL", '20px');
      }
      if (lastPage == pagecount) {
        file = file.replace("##TOTAL", totalRow);
        file = file.replace("##GRANDTABLE", grandTable);
      }
      else {
        file = file.replace("##TOTAL", "");
        file = file.replace("##GRANDTABLE", "");
      }
      file = file.replace("##OrderForm", "NA");
      // file = file.replace("##GTotal", (totalRs).toFixed(2));
      if (j == 25 || i + 1 == PRLineItems.length) {
        mergefile += file;
      }
    }
    const WindowPrt = window.open();
    WindowPrt?.document.write(mergefile);
    setTimeout(function () {
      WindowPrt?.document.close();
      WindowPrt?.focus();
      WindowPrt?.print();
      WindowPrt?.close();
    }, 2000);

    if(this.isPrint){
      if(this.fromOpenSales){
        this.router.navigate([]);
      }
      else{
        this.router.navigate([]);
      }
    }

  }
  subscribeOrderItems() {
    throw new Error('Method not implemented.');
  }


}
