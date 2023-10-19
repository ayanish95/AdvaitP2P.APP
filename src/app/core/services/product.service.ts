import { Injectable } from '@angular/core';
import { Api } from '@core/consts/api';
import { Method } from '@core/consts/method';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Products } from '@core/models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpclient: HttpClientService
  ) {}

  getProductList(): Observable<any> {
    return this.httpclient.authGet(`${Api.Product + Method.GetProductList}`);
  }
  getProductDetailsById(productId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Product + Method.GetProductDetailsById}/${productId}`);
  }

  addProduct(product:Products): Observable<any> {
    return this.httpclient.authPost(`${Api.Product + Method.AddProduct}`,product);
  }
  updateProduct(product:Products): Observable<any> {
    return this.httpclient.authPost(`${Api.Product + Method.UpdateProduct}`,product);
  }
  deleteProduct(productId:number): Observable<any> {
    return this.httpclient.authGet(`${Api.Product + Method.DeleteProduct}/${productId}`);
  }
}
