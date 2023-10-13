import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { FormlyConfigModule } from './formly-config.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@env/environment';
import { BASE_URL, httpInterceptorProviders, appInitializerProviders, API_URL, AuthService } from '@core';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDataService } from '@shared/in-mem/in-mem-data.service';
import { HttpClientService } from '@core/services/http-client.service';
import { RouteConfig } from '@core/config/route.config';
import { JwtModule } from '@auth0/angular-jwt';
import { jwtInterceptorProvider } from '@core/interceptors/jwt-interceptor.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ThemeModule,
    RoutesModule,
    SharedModule,
    FormlyConfigModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Demo purposes only for GitHub Pages
    HttpClientInMemoryWebApiModule.forRoot(InMemDataService, {
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: environment.WhitelistedDomains,
    //     disallowedRoutes: environment.BlacklistedDomains,
    //   },
    // }),
  ],
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: API_URL, useValue: environment.apiURL },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    httpInterceptorProviders,
    appInitializerProviders,
    // jwtInterceptorProvider,
    HttpClientService,
    RouteConfig,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
