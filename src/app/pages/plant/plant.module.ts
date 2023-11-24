import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantRoutingModule } from './plant-routing.module';
import { PlantListComponent } from './plant-list/plant-list.component';
import { SharedModule } from '@shared';
import { ViewPlantComponent } from './view-plant/view-plant.component';


@NgModule({
  declarations: [
    PlantListComponent,
    ViewPlantComponent
  ],
  imports: [
    CommonModule,
    PlantRoutingModule,
    SharedModule
  ]
})
export class PlantModule { }
