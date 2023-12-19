import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { authGuard } from '@core/authentication';
import { SupplierRegisterComponent } from './sessions/supplier-register/supplier-register.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      {
        path: 'pages',
        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
      },
      {
        path: 'masters/user',
        loadChildren: () => import('../pages/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'masters/supplier',
        loadChildren: () => import('../pages/supplier/supplier.module').then(m => m.SupplierModule),
      },
      {
        path: 'masters/product',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'masters/company',
        loadChildren: () => import('../pages/company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'masters/plant',
        loadChildren: () => import('../pages/plant/plant.module').then(m => m.PlantModule),
      },
      {
        path: 'pages/purchase-requisition',
        loadChildren: () => import('../pages/purchase-requisition/purchase-requisition.module').then(m => m.PurchaseRequisitionModule),
      },
      {
        path: 'config/approval-config',
        loadChildren: () => import('../pages/setting/setting.module').then(m => m.SettingModule),
      },
      {
        path: 'pages/purchase-order',
        loadChildren: () => import('../pages/purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule),
      },
      {
        path: 'pages/quotation',
        loadChildren: () => import('../pages/quotation/quotation.module').then(m => m.QuotationModule),
      },
      {
        path: 'pages/advance-shipping-notification',
        loadChildren: () => import('../pages/advance-shipping-notification/advance-shipping-notification.module').then(m => m.AdvanceShippingNotificationModule),
      },
      {
        path: 'pages/goods-received-note',
        loadChildren: () => import('../pages/goods-received-note/goods-received-note.module').then(m => m.GoodsReceivedNoteModule),
      },
      {
        path: 'pages/return-goods-received-note',
        loadChildren: () => import('../pages/return-goods-received-note/return-goods-received-note.module').then(m => m.ReturnGoodsReceivedNoteModule),
      },
      {
        path: 'pages/quality-control',
        loadChildren: () => import('../pages/quality-control/quality-control.module').then(m => m.QualityControlModule),
      },
      {
        path: 'design',
        loadChildren: () => import('./design/design.module').then(m => m.DesignModule),
      },
      {
        path: 'material',
        loadChildren: () => import('./material/material.module').then(m => m.MaterialModule),
      },
      {
        path: 'media',
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('./permissions/permissions.module').then(m => m.PermissionsModule),
      },
      {
        path: 'utilities',
        loadChildren: () => import('./utilities/utilities.module').then(m => m.UtilitiesModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: SupplierRegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
