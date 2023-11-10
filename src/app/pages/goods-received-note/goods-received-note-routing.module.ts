import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGoodsReceivedNoteComponent } from './list-goods-received-note/list-goods-received-note.component';
import { CreateGoodsReceivedNoteComponent } from './create-goods-received-note/create-goods-received-note.component';

const routes: Routes = [
  { path: '', component: ListGoodsReceivedNoteComponent },
  { path: 'create', component: CreateGoodsReceivedNoteComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceivedNoteRoutingModule { }
