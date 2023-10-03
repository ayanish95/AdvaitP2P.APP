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
  ) {}

  getSupplierList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierList}`);
  }

  supplierRegister(supplier:any){
    return this.httpclient.authPost(`${Api.Supplier + Method.CreateSupplier}`,supplier);
  }

  getSupplierByGSTNumber(gstNumber:string): Observable<any> {
    return this.httpclient.authGet(`${Api.Supplier + Method.GetSupplierByGSTNumber}/${gstNumber}`);
  }
}
