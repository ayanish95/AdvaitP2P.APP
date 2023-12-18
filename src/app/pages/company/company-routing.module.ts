import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
