import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';
import { EditPurchaseOrderComponent } from './edit-purchase-order/edit-purchase-order.component';
import { AllPurchaseOrderListComponent } from './all-purchase-order-list/all-purchase-order-list.component';
import { PendingPOForApprovalComponent } from './pending-po-for-approval/pending-po-for-approval.component';


@NgModule({
    declarations: [
        PurchaseOrderListComponent,
        CreatePurchaseOrderComponent,
        ViewPurchaseOrderComponent,
        EditPurchaseOrderComponent,
        AllPurchaseOrderListComponent,
        PendingPOForApprovalComponent
    ],
    imports: [
        CommonModule,
        PurchaseOrderRoutingModule,
        SharedModule
    ]
})
export class PurchaseOrderModule { }
