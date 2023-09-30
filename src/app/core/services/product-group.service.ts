import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  constructor(
    private httpclient: HttpClientService
  ) {}

  getProductGroupList(): Observable<any> {
    return this.httpclient.authGet(`${Api.ProductGroup + Method.GetProductGroupList}`);
  }
}
