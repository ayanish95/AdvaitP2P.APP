import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SharedModule } from '@shared';
import { AllSuplierListComponent } from './all-suplier-list/all-suplier-list.component';
import { PendingSuplierListComponent } from './pending-suplier-list/pending-suplier-list.component';
import { ApprovedSuplierListComponent } from './approved-suplier-list/approved-suplier-list.component';
import { AddSupplierForAdminComponent } from './add-supplier-for-admin/add-supplier-for-admin.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [SupplierListComponent, AllSuplierListComponent, PendingSuplierListComponent, ApprovedSuplierListComponent, AddSupplierForAdminComponent],
  imports: [CommonModule, SupplierRoutingModule, SharedModule,MatChipsModule,NgSelectModule],
})
export class SupplierModule {}
