import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [SupplierListComponent],
  imports: [CommonModule, SupplierRoutingModule, SharedModule],
})
export class SupplierModule {}
