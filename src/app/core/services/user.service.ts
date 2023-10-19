import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Users } from '@core/models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private httpclient: HttpClientService
  ) {}


  login(user:any) {
    return this.httpclient.authPost(`${Api.Auth + Method.Login}`,user);
  }
  getUserList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Users + Method.GetUserList}`);
  }
  addUser(user:Users): Observable<any> {
    return this.httpclient.authPost(`${Api.Users + Method.AddUser}`,user);
  }
  updateUser(user:Users): Observable<any> {
    return this.httpclient.authPost(`${Api.Users + Method.UpdateUser}`,user);
  }
  deleteUser(userId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Users + Method.DeleteUser}/${userId}`);
  }
  getUserDetailById(userId:number) {
    return this.httpclient.authGet(`${Api.Users + Method.GetUserDetailsById}/${userId}`);
  }
}
