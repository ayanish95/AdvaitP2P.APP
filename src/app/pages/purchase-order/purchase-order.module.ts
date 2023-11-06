import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';



@NgModule({
    declarations: [
        PurchaseOrderListComponent,
        CreatePurchaseOrderComponent,
        ViewPurchaseOrderComponent,

    ],
    imports: [
        CommonModule,
        PurchaseOrderRoutingModule,
        SharedModule
    ]
})
export class PurchaseOrderModule { }
