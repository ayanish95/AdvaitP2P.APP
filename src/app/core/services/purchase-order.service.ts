import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs/internal/Observable';
import { NumberInput } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private httpclient: HttpClientService) { }

  createPO(POVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseOrder + Method.CreatePurchaseOrder}`, POVM);
  }
  updatePO(POVM: any) {
    return this.httpclient.authPost(`${Api.PurchaseOrder + Method.UpdatePurchaseOrder}`, POVM);
  }
  getAllPOHeaderListByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetAllPurchaseOrderHeaderList}`);
  }
  
  getPODetailsById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetPurchaseOrderDetailsById}/${Id}`);
  }

  getPendingPOByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetPendingPurchaseOrderByUserId}`);
  }

  deletePO(Id:NumberInput): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.DeletePurchaseOrderById}/${Id}`);
  }
  deletePOLineByLineId(lineId:NumberInput): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.DeletePOLineItemByLineId}/${lineId}`);
  }

  approvePOById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.ApprovePRById}/${Id}`);
  }
  
  rejectPOById(Id:number): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.RejectPRById}/${Id}`);
  }

  getAllApprovedPOHeaderListByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetAllApprovedPurchaseOrderHeaderList}`);
  }

  getPendingASNByUserId(): Observable<any> {
    return this.httpclient.authGet(`${Api.PurchaseOrder + Method.GetAllApprovedPurchaseOrderHeaderList}`);
  }
}
