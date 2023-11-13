import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListReturnGoodsReceivedNoteComponent } from './list-return-goods-received-note/list-return-goods-received-note.component';
import { CreateReturnGoodsReceivedNoteComponent } from './create-return-goods-received-note/create-return-goods-received-note.component';
import { ViewReturnGoodsReceivedNoteComponent } from './view-return-goods-received-note/view-return-goods-received-note.component';

const routes: Routes = [
  {path:'',component: ListReturnGoodsReceivedNoteComponent},
  {path:'create',component: CreateReturnGoodsReceivedNoteComponent},
  {path:'view',component: ViewReturnGoodsReceivedNoteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnGoodsReceivedNoteRoutingModule { }
