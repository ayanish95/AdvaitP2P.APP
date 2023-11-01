import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';

const routes: Routes = [
  { path: '', component: PurchaseOrderListComponent },
  { path: 'create', component: CreatePurchaseOrderComponent },
  { path: 'view', component: ViewPurchaseOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
