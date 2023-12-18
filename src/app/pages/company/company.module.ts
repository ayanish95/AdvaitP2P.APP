import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyListComponent } from './company-list/company-list.component';
import { SharedModule } from '@shared';
import { AddCompanyComponent } from './add-company/add-company.component';


@NgModule({
  declarations: [
    CompanyListComponent,
    AddCompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule
  ]
})
export class CompanyModule { }
