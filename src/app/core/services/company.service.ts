import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private httpclient: HttpClientService
  ) { }

  syncCompanyFromSAP(): Observable<any> {
    return this.httpclient.authGet(`${Api.Company + Method.SyncCompanyFromSAP}`);
  }

  getCompanyList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Company + Method.GetAllCompanyList}`);
  }

  getCompanyDetailsById(companyId: number): Observable<any> {
    return this.httpclient.authGet(`${Api.Company + Method.GetCompanyDetailsById}/${companyId}`);
  }

  addCompany(company: any): Observable<any> {
    return this.httpclient.authPost(`${Api.Company + Method.AddCompany}`, company);
  }

  updateCompany(company: any): Observable<any> {
    return this.httpclient.authPost(`${Api.Company + Method.UpdateCompany}`, company);
  }
  
  deleteCompany(companyId: number): Observable<any> {
    return this.httpclient.authGet(`${Api.Company + Method.DeleteCompany}/${companyId}`);
  }
}
