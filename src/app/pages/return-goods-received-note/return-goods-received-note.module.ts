import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnGoodsReceivedNoteRoutingModule } from './return-goods-received-note-routing.module';
import { ListReturnGoodsReceivedNoteComponent } from './list-return-goods-received-note/list-return-goods-received-note.component';
import { SharedModule } from '@shared/shared.module';
import { CreateReturnGoodsReceivedNoteComponent } from './create-return-goods-received-note/create-return-goods-received-note.component';
import { ViewReturnGoodsReceivedNoteComponent } from './view-return-goods-received-note/view-return-goods-received-note.component';


@NgModule({
  declarations: [
    ListReturnGoodsReceivedNoteComponent,
    CreateReturnGoodsReceivedNoteComponent,
    ViewReturnGoodsReceivedNoteComponent
  ],
  imports: [
    CommonModule,
    ReturnGoodsReceivedNoteRoutingModule,
    SharedModule

  ]
})
export class ReturnGoodsReceivedNoteModule { }
