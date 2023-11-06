import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAdvancedShippingNotificationComponent } from './create-advanced-shipping-notification/create-advanced-shipping-notification.component';
import { AsnListComponent } from './asn-list/asn-list.component';

const routes: Routes = [
  { path: '', component: AsnListComponent },
  { path: 'add-asn', component: CreateAdvancedShippingNotificationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceShippingNotificationRoutingModule { }
