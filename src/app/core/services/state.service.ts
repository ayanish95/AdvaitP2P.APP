import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  
  constructor(
    private httpclient: HttpClientService
  ) {}

  getStateList(): Observable<any> {
    return this.httpclient.authGet(`${Api.State + Method.GetStateList}`);
  }
  getStateListByCountryCode(countryCode:string): Observable<any> {
    return this.httpclient.authGet(`${Api.State + Method.GetStateListByCountryCode}/${countryCode}`);
  }
}
