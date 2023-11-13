import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceShippingNotificationRoutingModule } from './advance-shipping-notification-routing.module';
import { CreateAdvancedShippingNotificationComponent } from './create-advanced-shipping-notification/create-advanced-shipping-notification.component';
import { SharedModule } from '../../shared/shared.module';
import { AsnListComponent } from './asn-list/asn-list.component';
import { AllAsnListComponent } from './all-asn-list/all-asn-list.component';


@NgModule({
  declarations: [
    CreateAdvancedShippingNotificationComponent,
    AsnListComponent,
    AllAsnListComponent
  ],
  imports: [
    CommonModule,
    AdvanceShippingNotificationRoutingModule,
    SharedModule
  ]
})
export class AdvanceShippingNotificationModule { }
