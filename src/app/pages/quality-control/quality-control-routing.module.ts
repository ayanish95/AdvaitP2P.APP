import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualityControlListComponent } from './quality-control-list/quality-control-list.component';
import { CreateQualityControlComponent } from './create-quality-control/create-quality-control.component';
import { ViewQualityControlComponent } from './view-quality-control/view-quality-control.component';

const routes: Routes = [
  { path: '', component: QualityControlListComponent },
  { path: 'create', component: CreateQualityControlComponent },
  { path: 'view', component: ViewQualityControlComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityControlRoutingModule { }
