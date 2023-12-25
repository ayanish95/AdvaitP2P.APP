import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import template from '@core/purchaseordertemplate';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.scss']
})
export class ViewPurchaseOrderComponent {

  public isPrint = false;
  public fromOpenSales = false;


  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'ProductGroup',
    'Qty',
    'Unit',
    'DeliveryDate',
    'Location',
    'Close',

  ];
  PRId!: number;
  PODetails!: PurchaseOrderVM;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private PRService: PurchaseRequistionService,
      private POService: PurchaseOrderService,
      private toaster: ToastrService,
      private location: Location,
      private route: ActivatedRoute,
      private router: Router) {

    this.route.queryParams.subscribe((params: any) => {
      this.PRId = params.id;
    });
  }


  ngOnInit(): void {
    // this.PRService
    //   .getPRDetailsById(this.PRId)
    //   .pipe(
    //     finalize(() => {
    //     })
    //   )
    //   .subscribe(res => {
    //     if (res[ResultEnum.IsSuccess]) {
    //       console.log(res[ResultEnum.Model]);
    //       if (res[ResultEnum.Model]) {
    //         this.PRDetails = res[ResultEnum.Model];
    //         this.dataSource.data = this.PRDetails.PRLineItems;
    //       }
    //       else
    //         this.toaster.error(res[ResultEnum.Message]);
    //     }
    //     else
    //       this.toaster.error(res[ResultEnum.Message]);
    //   });


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
    //debugger;
    let mergefile = '';
    let orderRow = '';
    const totalRow = '';
    const grandTable = '';
    const TotalNetPrice='';
    let Pono = 0;
    let Podate = '';
    let Suppliercode = '';
    let Plantname = '';
    let Suppliername = '';
    const Supplieradd = '';
    const Plantadd = '';
    const Suppliercon = '';
    const Plantcon = '';
    const Supplieremail = '';
    const Plantemail = '';
    const Suppliergstin = '';
    const Plantgstin = '';
    const Supplierpan = '';
    const Plantpan = '';
    const custNum = '';
    let city = '';
    let orderBy = '';
    let remarks = '';
    const address = '';
    let j = 0;
    let pagecount = 1;
    const PODetailsForPrint = [];
    if (this.PODetails) {
      Pono = this.PODetails.Id ?? 0;

      if (this.PODetails && this.PODetails.PODate instanceof Date) {
        Podate = this.PODetails.PODate.toString();
      } else {
        Podate = '';
      }

      Podate = formatDate(  this.PODetails.PODate?.toString()??'' ,'dd-MM-yyyy', 'en-US');

      // Suppliercode = this.PODetails.SupplierCode ?? '';
      // Suppliername = this.PODetails.SupplierName ?? '';
     // Plantname = this.PODetails.POLineItems[0].PlantDescription ?? '';
      // city = this.PODetails.SupplierName ?? '';
      // orderBy = this.PODetails.SupplierName ?? '';
      // remarks = this.PODetails.SupplierName ?? '';

    }


    const lastPage = Math.ceil(this.PODetails.POLineItems.length / 25);
    for (let i = 0; i < this.PODetails.POLineItems.length; i++) {
      let file = template.toString();

      if (j == 26) {
        j = 1;
        orderRow = '';
        pagecount++;
      }

      if (remarks == null) {
        remarks = '';
      }


      orderRow += '<tr>';
      orderRow += '<td>' + (1 + i) + '</td>';
      // orderRow += '<td>' + this.PODetails.POLineItems[i].ProductCode + '</td>';
     // orderRow += '<td>' + this.PODetails.POLineItems[i].ProductDescription + '</td>';
      orderRow += '<td>' +   + '</td>';
      orderRow += '<td>' + this.PODetails.POLineItems[i].Qty + '</td>';
      //orderRow +='<td>' + this.PODetails.POLineItems[i].UnitName + '</td>';
      orderRow +='<td>' +  this.PODetails.POLineItems[i].NetPrice+ '</td>';
      //orderRow +='<td>' + formatDate(  this.PODetails.POLineItems[i].DeliveryDate  ,'dd-MM-yyyy', 'en-US'); + '</td>';
      orderRow +='<td>' +  this.PODetails.POLineItems[i].TotalNetPrice+ '</td>';

      orderRow += '</tr>';

      file = file.replace(/(\r\n|\n|\r)/gm, '');
      file = file.replace('##PAGE', '#' + pagecount + ' of ' + lastPage);
      file = file.replace('##Pono', Pono.toString());
      file = file.replace('##Podate', Podate.toString());
      file = file.replace('##Suppliercode', Suppliercode);
      file = file.replace('##Plantname', Plantname);
      file = file.replace('##Suppliername', Suppliername);
      file = file.replace('##ORDERITEM', orderRow);
      file = file.replace('##Supplieradd', Supplieradd);
      file = file.replace('##Plantadd', Plantadd);
      file = file.replace('##Suppliercon', Suppliercon);
      file = file.replace('##Plantcon', Plantcon);
      file = file.replace('##Supplieremail', Supplieremail);
      file = file.replace('##Plantemail', Plantemail);
      file = file.replace('##Suppliergstin', Suppliergstin);
      file = file.replace('##Plantgstin', Plantgstin);
      file = file.replace('##Supplierpan', Supplierpan);
      file = file.replace('##Plantpan', Plantpan);
      file = file.replace('##CustNum', custNum);
      file = file.replace('##CITY', city);
      file = file.replace('##ORDERBY', orderBy);
      file = file.replace('##REMARKS', remarks);
      file = file.replace('##ADDRESS', address);
      file = file.replace('##TOTAL', TotalNetPrice);

      if (pagecount == 1 || lastPage == pagecount) {
        file = file.replace('##PIXAL', '10px');
      }
      else {
        file = file.replace('##PIXAL', '20px');
      }
      if (lastPage == pagecount) {
        file = file.replace('##TOTAL', totalRow);
        file = file.replace('##GRANDTABLE', grandTable);
      }
      else {
        file = file.replace('##TOTAL', '');
        file = file.replace('##GRANDTABLE', '');
      }
      file = file.replace('##OrderForm', 'NA');
      if (j == 25 || i + 1 == this.PODetails.POLineItems.length) {
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
  onClickBack() {
    this.location.back();
  }

}
