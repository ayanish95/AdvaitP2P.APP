import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGoodsReceivedNoteComponent } from './list-goods-received-note/list-goods-received-note.component';
import { CreateGoodsReceivedNoteComponent } from './create-goods-received-note/create-goods-received-note.component';
import { ViewGoodsReceivedNoteComponent } from './view-goods-received-note/view-goods-received-note.component';
import { EditGoodsReceivedNoteComponent } from './edit-goods-received-note/edit-goods-received-note.component';

const routes: Routes = [
  { path: '', component: ListGoodsReceivedNoteComponent },
  { path: 'create', component: CreateGoodsReceivedNoteComponent },
  { path: 'view', component: ViewGoodsReceivedNoteComponent },
  { path: 'edit-grn', component: EditGoodsReceivedNoteComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceivedNoteRoutingModule { }
