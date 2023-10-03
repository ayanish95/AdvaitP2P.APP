import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

   
  constructor(
    private httpclient: HttpClientService
  ) {}

  getCountryList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Country + Method.GetCountryList}`);
  }
  
}
