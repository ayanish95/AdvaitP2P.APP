import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsReceivedNoteRoutingModule } from './goods-received-note-routing.module';
import { ListGoodsReceivedNoteComponent } from './list-goods-received-note/list-goods-received-note.component';
import { SharedModule } from '@shared';
import { CreateGoodsReceivedNoteComponent } from './create-goods-received-note/create-goods-received-note.component';
import { ViewGoodsReceivedNoteComponent } from './view-goods-received-note/view-goods-received-note.component';


@NgModule({
  declarations: [
    ListGoodsReceivedNoteComponent,
    CreateGoodsReceivedNoteComponent,
    ViewGoodsReceivedNoteComponent
  ],
  imports: [
    CommonModule,
    GoodsReceivedNoteRoutingModule,
    SharedModule    
  ]
})
export class GoodsReceivedNoteModule { }
