import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';

@Injectable({
      providedIn: 'root'
})

export class ReturnGoodsReceptionNotificationService {

      constructor(private httpclient: HttpClientService) { }
}