import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

@Injectable({
      providedIn: 'root'
})

export class AdvanceShippingNotificationService {

      constructor(private httpclient: HttpClientService) { }
      GetAllASNList(): Observable<any> {
        return this.httpclient.authGet(`${Api.AdvancedShipmentNotification + Method.GetAllASNList}`);
      }

      GetAllASNListForGRCreation(): Observable<any> {
        return this.httpclient.authGet(`${Api.AdvancedShipmentNotification + Method.GetAllASNListForGR}`);
      }

      AddAsn(POVM: any) {
        return this.httpclient.authPost(`${Api.AdvancedShipmentNotification + Method.AddASN}`,POVM);
      }

      GetASNDetailsById(asnId:number): Observable<any> {
        return this.httpclient.authGet(`${Api.AdvancedShipmentNotification + Method.GetAllASNDetailsById}/${asnId}`);
      }

      DeleteASNDetailsById(asnId:number): Observable<any> {
        return this.httpclient.authGet(`${Api.AdvancedShipmentNotification + Method.DeleteASNById}/${asnId}`);
      }

      UpdateASNDetails(ASNVM:any): Observable<any> {
        return this.httpclient.authPost(`${Api.AdvancedShipmentNotification + Method.UpdateASN}`,ASNVM);
      }
}
