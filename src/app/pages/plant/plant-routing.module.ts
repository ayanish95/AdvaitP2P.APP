import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantListComponent } from './plant-list/plant-list.component';
import { ViewPlantComponent } from './view-plant/view-plant.component';

const routes: Routes = [{ path: '', component: PlantListComponent },
{ path: 'view', component: ViewPlantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantRoutingModule { }
