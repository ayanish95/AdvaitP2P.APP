import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRequisitionRoutingModule } from './purchase-requisition-routing.module';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';
import { SharedModule } from '@shared';
import { CreatePurchaseRequisitionComponent } from './create-purchase-requisition/create-purchase-requisition.component';
import { ViewPurchaseRequisitionComponent } from './view-purchase-requisition/view-purchase-requisition.component';
import { EditPurchaseRequisitionComponent } from './edit-purchase-requisition/edit-purchase-requisition.component';
import { PendingForApprovalComponent } from './pending-for-approval/pending-for-approval.component';
import { AllPurchaseRequisitionListComponent } from './all-purchase-requisition-list/all-purchase-requisition-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    PurchaseRequisitionListComponent,
    CreatePurchaseRequisitionComponent,
    ViewPurchaseRequisitionComponent,
    EditPurchaseRequisitionComponent,
    PendingForApprovalComponent,
    AllPurchaseRequisitionListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PurchaseRequisitionRoutingModule,
    NgSelectModule,
    NgxMatSelectSearchModule
  ]
})
export class PurchaseRequisitionModule { }
