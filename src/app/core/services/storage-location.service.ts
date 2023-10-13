import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageLocationService {

  constructor(private httpclient: HttpClientService) { }
  
  getStorageLocationByPlantCode(plantCode: string): Observable<any> {
    return this.httpclient.authGet(`${Api.StorageLocation + Method.GetStorageLocationByPlantCode}/${plantCode}`);
  }
}
