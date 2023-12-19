import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { Company } from '@core/models/company';
import { CompanyService } from '@core/services/company.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss']
})
export class ViewCompanyComponent {

  companyId!:number;
  companyDetails!:Company;
  constructor(private location: Location, private toaster: ToastrService, private companyService: CompanyService,
    private route: ActivatedRoute,private router: Router) {

    this.route.queryParams.subscribe((params: any) => {
      this.companyId = params.id;
    });
  }

  ngOnInit(): void {
    //API product details by product id
    this.companyService
      .getCompanyDetailsById(this.companyId).subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.companyDetails = res[ResultEnum.Model];
          }
          else{
            this.toaster.error(res[ResultEnum.Message]);
            this.router.navigateByUrl('/masters/company');
          }
        }
        else{
          this.toaster.error(res[ResultEnum.Message]);
          this.router.navigateByUrl('/masters/company');
        }
      });
  }

  //On click back button
  onClickBack() {
    this.location.back();
  }

}
