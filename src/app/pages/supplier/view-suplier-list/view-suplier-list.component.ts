import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { PurchaseRequisitionDataVM, PurchaseRequisitionDetailsVM } from '@core/models/purchase-requistion';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-suplier-list',
  templateUrl: './view-suplier-list.component.html',
  styleUrls: ['./view-suplier-list.component.scss']
})
export class ViewSuplierListComponent {
  displayedColumns: string[] = [
    'srNo',
    'ProductCode',
    'ProductGroup',
    'Qty',
    'Unit',
    'Plant',
    'Location',
    // 'Close',
    // 'RFQ',
  ];
  SpId!: number;
  allSuppliierList!: Suppliers;
  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private supplierService: SupplierService,private location: Location, private toaster: ToastrService, private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.SpId = params.id;
    });
  }

  ngOnInit(): void {
    this.supplierService

      .getSupplierDetailById(this.SpId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {        
        if (res[ResultEnum.IsSuccess]) {
          console.log(res[ResultEnum.Model]);
          if (res[ResultEnum.Model]) {
            this.allSuppliierList = res[ResultEnum.Model];
            console.log(this.allSuppliierList);
            // this.dataSource.data = this.allSuppliierList.State;
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
