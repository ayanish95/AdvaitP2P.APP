import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpclient: HttpClientService) {}

  getUserList() {
    return this.httpclient.authGet(`${Api.Users + Method.GetUserList}`);
  }
}
