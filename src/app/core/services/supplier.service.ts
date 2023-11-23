import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Role } from '@core/enums/role';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(
    private httpclient: HttpClientService
  ) { }

  getSupplierList(isApproved?: boolean): Observable<any> {
    let url = `${Api.Supplier + Method.GetSupplierList}`;
    if (isApproved != null)
      url += `/${isApproved}`;
    return this.httpclient.authGet(url);
  }
 
  supplierRegister(supplier: any) {
    return this.httpclient.authPost(`${Api.Supplier + Method.CreateSupplier}`, supplier);
  }
  approveSupplier(supplierId: any,currentRole:any) {
    return this.httpclient.authPost(`${Api.Supplier + Method.ApproveSupplier}/${currentRole}`,supplierId);
  }

  getSupplierByGSTNumber(gstNumber: string): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierByGSTNumber}/${gstNumber}`);
  }
  getSupplierDetailById(supplierId: number): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierDetailsById}/${supplierId}`);
  }
  supplierRegisterFromAdmin(supplier: any) {
    return this.httpclient.authPost(`${Api.Supplier + Method.AddSupplierFromAdminSide}`, supplier);
  }
  updateSupplier(supplier: any) {
    return this.httpclient.authPost(`${Api.Supplier + Method.UpdateSupplier}`, supplier);
  }
  deleteSupplier(supplierId: any) {
    return this.httpclient.authGet(`${Api.Supplier + Method.DeleteSupplier}/${supplierId}`);
  }
  rejectSupplier(supplierId: any) {
    return this.httpclient.authGet(`${Api.Supplier + Method.RejectSupplier}/${supplierId}`);
  }
}
