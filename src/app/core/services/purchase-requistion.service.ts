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
  getAllPRNumberForPO(docType?:string,plantId?:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetAllPRNumberForPO}/${docType}/${plantId}`);
  }
  getAllPRHeaderListByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetAllPRHeaderListByUserId}`);
  }
  getPendingPRByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetPendingPRByUserId}`);
  }

  getPRDetailsById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetPRDetailsById}/${Id}`);
  }

  getPRDetailsForPO(Id:string): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.GetPRDetailsForPO}/${Id}`);
  }

  createPR(PRVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseRequisition + Method.CreatePurchaseRequisition}`, PRVM);
  }
  updatePR(PRVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseRequisition + Method.UpdatePurchaseRequisition}`, PRVM);
  }

  deletePR(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.DeletePurchaseRequisitionById}/${Id}`);
  }
  deletePRLineByLineId(lineId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.DeletePRLineItemByLineId}/${lineId}`);
  }

  approvePRById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.ApprovePRById}/${Id}`);
  }

  rejectPRById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseRequisition + Method.RejectPRById}/${Id}`);
  }
}
