import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ViewSuplierListComponent } from './view-suplier-list/view-suplier-list.component';

const routes: Routes = [{ path: '', component: SupplierListComponent },
{ path: 'view', component: ViewSuplierListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}
