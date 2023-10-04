import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { filterObject, isEmptyObject } from './helpers';
import { MyUser } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '@core/enums/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<MyUser>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    // public jwtHelper: JwtHelperService
  ) {}

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token =>{ this.tokenService.set(token)
        console.log('token',token);
        }),
      map(() => this.check())
    );
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }

  static getToken(): string {
    return localStorage.getItem('access_token')!;
  }

//   static setToken(token: string): void {
//     localStorage.setItem('access_token', token);
//   }
//   static removeToken(): void {
//     localStorage.removeItem('access_token');
//   }
//   public isAuthenticated(): boolean {
//     return !this.jwtHelper.isTokenExpired(AuthService.getToken());
//   }
//   public roles(): any {
//     let value = this.jwtHelper.decodeToken(AuthService.getToken())
//     return Role[value.Role];
//   }
//   /**
//    * get user id from token
//    * 
//    */
//   public userId(): number {
//     let value = this.jwtHelper.decodeToken(AuthService.getToken())
//     return value.UId;
//   }
//   /**
//      * get User Name from token
//      * 
//      */
//   public userName(): string {
//     let value = this.jwtHelper.decodeToken(AuthService.getToken())
//     return value.UserName;
//   }
// /**
//    * get User Name from token
//    * 
//    */
//  public CustNum(): string{
//   let value = this.jwtHelper.decodeToken(AuthService.getToken())
//   return value.CustNum;
// }


//   public custName(): string {
//     let value = this.jwtHelper.decodeToken(AuthService.getToken());
//     return value.CustNum;
//   }

//   public Name() : string {
//     let value = this.jwtHelper.decodeToken(AuthService.getToken())
//     return value.Name;
//   }
}
