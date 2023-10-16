import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRequisitionRoutingModule } from './purchase-requisition-routing.module';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';
import { SharedModule } from '@shared';
import { CreatePurchaseRequisitionComponent } from './create-purchase-requisition/create-purchase-requisition.component';
import { ViewPurchaseRequisitionComponent } from './view-purchase-requisition/view-purchase-requisition.component';


@NgModule({
  declarations: [
    PurchaseRequisitionListComponent,
    CreatePurchaseRequisitionComponent,
    ViewPurchaseRequisitionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PurchaseRequisitionRoutingModule
  ]
})
export class PurchaseRequisitionModule { }
