import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

@Injectable({
      providedIn: 'root'
})

export class ReturnGoodsReceptionNotificationService {

      constructor(private httpclient: HttpClientService) { }

}