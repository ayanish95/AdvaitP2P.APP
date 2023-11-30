import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';


@Injectable({
      providedIn: 'root'
})

export class ReturnGoodsReceptionNotificationService {

      constructor(private httpclient: HttpClientService) { }

      CreateGRN(GRNVM: any) {
        return this.httpclient.authPost(`${Api.GoodsReceiptNotification + Method.CreateGR}`,GRNVM);
      }
      GetallGrList(): Observable<any> {
        return this.httpclient.authGet(`${Api.GoodsReceiptNotification + Method.GetAllGRList}`);
      }

  getGrnDetailsById(GrnId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GrnListById}/${GrnId}`);
  }

}
