import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';
import { CreatePurchaseRequisitionComponent } from './create-purchase-requisition/create-purchase-requisition.component';
import { ViewPurchaseRequisitionComponent } from './view-purchase-requisition/view-purchase-requisition.component';
import { EditPurchaseRequisitionComponent } from './edit-purchase-requisition/edit-purchase-requisition.component';

const routes: Routes = [
  { path: '', component: PurchaseRequisitionListComponent },
  { path: 'create', component: CreatePurchaseRequisitionComponent },
  { path: 'edit', component: EditPurchaseRequisitionComponent },
  { path: 'view', component: ViewPurchaseRequisitionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequisitionRoutingModule { }
