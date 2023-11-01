import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService, TokenService } from '@core/authentication';
import { UserService } from '@core/services/user.service';
import { LoginUser, Otp } from '@core/models/users';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });
  loginDetails!: LoginUser;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private tokenService: TokenService,
  ) { }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;
    this.loginDetails = {
      UserName: this.username.value,
      Password: this.password.value,
      OtpCode: '',
      Otp: new Otp
    };

    // this.userService.login(this.loginDetails)
    // .pipe(filter(authenticated => authenticated))
    // .subscribe({
    //   next: (res: any) => {
    //     if (res[ResultEnum.IsSuccess]) {
    //       let acce_token= res[ResultEnum.Model].access_token;
    //       let token = {
    //         access_token:acce_token,
    //         token_type:'bearer'
    //       }
    //       // AuthService.setToken(res[ResultEnum.Model].access_token);
    //       this.tokenService.set(token)
    //       this.router.navigateByUrl('/')
    //     }
    //     else {
    //       this.toast.error(res[ResultEnum.Message]);
    //       this.isSubmitting = false;
    //     }
    //     // this.router.navigateByUrl('/')
    //   },
    //   error: (errorRes: HttpErrorResponse) => {
    //     if (errorRes.status === 422) {
    //       const form = this.loginForm;
    //       const errors = errorRes.error.errors;
    //       Object.keys(errors).forEach(key => {
    //         form.get(key === 'email' ? 'username' : key)?.setErrors({
    //           remote: errors[key][0],
    //         });
    //       });
    //     }
    //     this.isSubmitting = false;
    //   },
    //   complete() {
    //     console.log('success');

    //   },
    // });


    this.auth
      .login(this.username.value, this.password.value, this.rememberMe.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        },
      });
  }
}
