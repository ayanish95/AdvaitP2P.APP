import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { ApprovalTypes } from '@core/models/approval-type';

@Injectable({
  providedIn: 'root'
})
export class ApprovalTypeService {

  constructor(
    private httpclient: HttpClientService
  ) {}

  getAllApprovalTypeList(): Observable<any> {
    return this.httpclient.authGet(`${Api.ApprovalType + Method.GetAllApprovalTypeList}`);
  }
  
  addApprovalType(approval:ApprovalTypes): Observable<any> {
    return this.httpclient.authPost(`${Api.ApprovalType + Method.AddApprovalType}`,approval);
  }
  updateApprovalType(approval:ApprovalTypes): Observable<any> {
    return this.httpclient.authPost(`${Api.ApprovalType + Method.UpdateApprovalType}`,approval);
  }
  deleteApprovalType(typeId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.ApprovalType + Method.DeleteApprovalType}/${typeId}`);
  }
  getApprovalTypeDetailsById(typeId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.ApprovalType + Method.GetApprovalTypeDetailsById}/${typeId}`);
  }
}
