import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';
import { CreatePurchaseRequisitionComponent } from './create-purchase-requisition/create-purchase-requisition.component';

const routes: Routes = [
  { path: '', component: PurchaseRequisitionListComponent },
  { path: 'create', component: CreatePurchaseRequisitionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequisitionRoutingModule { }
