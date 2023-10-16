import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequistionService {

  constructor(private httpclient: HttpClientService) { }

  getAllPRHeaderList(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetAllPRHeaderList}`);
  }

  getPRDetailsById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetPRDetailsById}/${Id}`);
  }

  createPR(PRVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseRequisition + Method.CreatePurchaseRequisition}`, PRVM);
  }
}
