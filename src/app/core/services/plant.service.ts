import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(
    private httpclient: HttpClientService
  ) {}

  getPlantList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GetPlantList}`);
  }
}
