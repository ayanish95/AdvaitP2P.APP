import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { ProductService } from '@core/services/product.service';
import { Products } from '@core/models/products';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent {
  displayedColumns: string[] = [
    'srNo',
    'Plant',
    'PriceIndicator',
    'StandardPrice',
    'MovingAvgPrice',
    'HSNCode',
    'IsBatchNo',
    'IsSerialNo',
  ];
  productid!: number;
  productDetails!: Products;


  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private location: Location, private toaster: ToastrService, private productService: ProductService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.productid = params.id;
    });
  }

  ngOnInit(): void {
    this.productService
      .getProductDetailsById(this.productid)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.productDetails = res[ResultEnum.Model];
            if(res[ResultEnum.Model]?.ProductPlantMapping.length>0){
              this.dataSource.data=res[ResultEnum.Model]?.ProductPlantMapping;
            }
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
