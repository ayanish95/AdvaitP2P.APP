import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private httpclient: HttpClientService
  ) {}

  getUserList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Users + Method.GetUserList}`);
  }
}
