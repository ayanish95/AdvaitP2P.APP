import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalConfigComponent } from './approval-config/approval-config.component';
import { AddApprovalConfigComponent } from './add-approval-config/add-approval-config.component';
import { AddApprovalStrategyComponent } from './add-approval-strategy/add-approval-strategy.component';

const routes: Routes = [
  { path: '', component: ApprovalConfigComponent },
  { path: 'approval-config', component: ApprovalConfigComponent },
  { path: 'add-approval', component: AddApprovalConfigComponent },
  { path: 'add-strategy', component: AddApprovalStrategyComponent },
  { path: 'edit-approval', component: AddApprovalConfigComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
