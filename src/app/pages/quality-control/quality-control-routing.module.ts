import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualityControlListComponent } from './quality-control-list/quality-control-list.component';
import { CreateQualityControlComponent } from './create-quality-control/create-quality-control.component';

const routes: Routes = [
  { path: '', component: QualityControlListComponent },
  { path: 'create', component: CreateQualityControlComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityControlRoutingModule { }
