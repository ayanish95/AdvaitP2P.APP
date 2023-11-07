import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private httpclient: HttpClientService) { }

  createPO(POVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseOrder + Method.CreatePurchaseOrder}`, POVM);
  }
  getAllPOHeaderListByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetAllPurchaseOrderHeaderList}`);
  }
  
  getPODetailsById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetPurchaseOrderDetailsById}/${Id}`);
  }
}
