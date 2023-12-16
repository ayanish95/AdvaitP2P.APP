import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { PlantService } from '@core/services/plant.service';
import { Plants } from '@core/models/plants';


@Component({
  selector: 'app-view-plant',
  templateUrl: './view-plant.component.html',
  styleUrls: ['./view-plant.component.scss']
})
export class ViewPlantComponent {
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
  plantid!: number;
  plantDetails!: Plants;


  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private location: Location, private toaster: ToastrService,private plantService: PlantService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.plantid = params.id;
    });
  }

  ngOnInit(): void {
    this.plantService
      .getPlantDetailsById(this.plantid)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.plantDetails = res[ResultEnum.Model];
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
