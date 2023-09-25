import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class RouteConfig {
  Url(url: any): string {
    return `${environment.apiURL.toString()}/${url}`;
  }
}
