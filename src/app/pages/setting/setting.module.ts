import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { ApprovalConfigComponent } from './approval-config/approval-config.component';
import { SharedModule } from '@shared';
import { AddApprovalConfigComponent } from './add-approval-config/add-approval-config.component';
import { AddApprovalStrategyComponent } from './add-approval-strategy/add-approval-strategy.component';


@NgModule({
  declarations: [
    ApprovalConfigComponent,
    AddApprovalConfigComponent,
    AddApprovalStrategyComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule
  ]
})
export class SettingModule { }
