import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

@Injectable({
      providedIn: 'root'
})

export class GoodsReceptionNotificationService {

      constructor(private httpclient: HttpClientService) { }


      CreateGRN(GRNVM: any) {
            return this.httpclient.authPost(`${Api.GoodsReceiptNotification + Method.CreateGR}`, GRNVM);
      }
      GetAllGRList() {
            return this.httpclient.authGet(`${Api.GoodsReceiptNotification + Method.GetAllGRList}`);
      }
      GetAllGRListForQC(Id:number) {
            return this.httpclient.authGet(`${Api.GoodsReceiptNotification + Method.GetAllGRListForQC}/${Id}`);
      }
      GetGRNDetailsById(Id:number) {
        return this.httpclient.authGet(`${Api.GoodsReceiptNotification + Method.GetGRNDetailsById}/${Id}`);
  }
      DeleteGRById(Id:number) {
            return this.httpclient.authGet(`${Api.GoodsReceiptNotification + Method.DeleteGRById}/${Id}`);
      }
}
