import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { Plants } from '@core/models/plants';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(
    private httpclient: HttpClientService
  ) {}

  syncPlantsFromSAP(): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.SyncPlantsFromSAP}`);
  }
  getPlantList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GetPlantList}`);
  }
  getPlantListByPlantCode(plantCode:string): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GetPlantListByPlantCode}/${plantCode}`);
  }

  getPlantListByCompanyCode(companyCode:string): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GetPlantListByCompanyCode}/${companyCode}`);
  }

  getPlantDetailsById(plantId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.GetPlantDetailsById}/${plantId}`);
  }

  addPlant(plant:Plants): Observable<any> {
    return this.httpclient.authPost(`${Api.Plant + Method.AddPlant}`,plant);
  }
  updatePlant(plant:Plants): Observable<any> {
    return this.httpclient.authPost(`${Api.Plant + Method.UpdatePlant}`,plant);
  }
  deletePlant(plantId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Plant + Method.DeletePlant}/${plantId}`);
  }

}
