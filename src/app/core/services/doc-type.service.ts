import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DocTypeService {

  constructor(private httpclient: HttpClientService) { }
  
  getAllDocType(): Observable<any> {
    return this.httpclient.authGet(`${Api.DocType + Method.GetDocTypeList}`);
  }
}
