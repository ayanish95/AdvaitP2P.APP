import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { ApprovalStrategy, ApprovalTypes } from '@core/models/approval-type';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalStrategyService {

  constructor(
    private httpclient: HttpClientService
  ) {}
  
  
  getStrategyDetailsByApprovalTypeId(approvalId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.ApprovalStrategy + Method.GetApprovalStrategyDeailsByApprovalId}/${approvalId}`);
  } 
  getApprovalStrategyByApprovalType(approvalType:string): Observable<any> {
    return this.httpclient.authGet(`${Api.ApprovalStrategy + Method.GetApprovalStrategyByApprovalType}/${approvalType}`);
  }
  addApprovalStrategy(approval:ApprovalStrategy[]): Observable<any> {
    return this.httpclient.authPost(`${Api.ApprovalStrategy + Method.AddStrategy}`,approval);
  }
}
