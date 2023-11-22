import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityControlRoutingModule } from './quality-control-routing.module';
import { QualityControlListComponent } from './quality-control-list/quality-control-list.component';
import { CreateQualityControlComponent } from './create-quality-control/create-quality-control.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    QualityControlListComponent,
    CreateQualityControlComponent
  ],
  imports: [
    CommonModule,
    QualityControlRoutingModule,
    SharedModule,
  ]
})
export class QualityControlModule { }
