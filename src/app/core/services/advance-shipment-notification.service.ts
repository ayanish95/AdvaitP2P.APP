import { Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";

@Injectable({
      providedIn: 'root'
})

export class AdvanceShippingNotificationService {

      constructor(private httpclient: HttpClientService) { }
}