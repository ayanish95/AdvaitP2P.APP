import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '@shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewUserComponent } from './view-user/view-user.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [UserListComponent, ViewUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgbPaginationModule,
    // NgbModule
  ],
})
export class UsersModule {}
