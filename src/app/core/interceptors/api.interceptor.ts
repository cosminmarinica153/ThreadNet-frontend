import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
     headers: request.headers.set('Content-Type', 'application/json')
                             .set('Ocp-Apim-Subscription-Key', 'dd00d76295b64dbeb6b5d632b98e48bb')
   });
    return next.handle(clonedRequest);
  }
}
