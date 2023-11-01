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

  createPR(PRVM: any,currentUserId:number) {
    return this.httpclient.authPost(`${Api.PurchaseRequisition + Method.CreatePurchaseRequisition}/${currentUserId}`, PRVM);
  } 
  updatePR(PRVM: any,currentUserId:number) {
    return this.httpclient.authPost(`${Api.PurchaseRequisition + Method.UpdatePurchaseRequisition}/${currentUserId}`, PRVM);
  }

  deletePR(Id:number,currentUserId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.DeletePurchaseRequisitionById}/${Id}/${currentUserId}`);
  }
  deletePRLineByLineId(lineId:number,currentUserId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.DeletePRLineItemByLineId}/${lineId}/${currentUserId}`);
  }
}
