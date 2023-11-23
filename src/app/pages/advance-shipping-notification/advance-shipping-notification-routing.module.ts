import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAdvancedShippingNotificationComponent } from './create-advanced-shipping-notification/create-advanced-shipping-notification.component';
import { AsnListComponent } from './asn-list/asn-list.component';
import { ViewAdvanceShippingNotificationComponent } from './view-advance-shipping-notification/view-advance-shipping-notification.component';

const routes: Routes = [
  { path: '', component: AsnListComponent },
  { path: 'add-asn', component: CreateAdvancedShippingNotificationComponent },
  { path: 'view', component: ViewAdvanceShippingNotificationComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceShippingNotificationRoutingModule { }
