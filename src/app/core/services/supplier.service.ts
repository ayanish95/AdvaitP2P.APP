import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

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
  approveSupplier(supplierId: any) {
    return this.httpclient.authPost(`${Api.Supplier + Method.ApproveSupplier}`,supplierId);
  }
  
  getSupplierByGSTNumber(gstNumber: string): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierByGSTNumber}/${gstNumber}`);
  }
  getSupplierDetailById(supplierId: number): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierDetailsById}/${supplierId}`);
  }
}
