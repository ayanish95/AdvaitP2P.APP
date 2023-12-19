import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { ViewCompanyComponent } from './view-company/view-company.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'view', component: ViewCompanyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
