import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { MessageService } from '@shared';
import { LoadingOverlayRef, LoadingService } from '@core/services/loading.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private messenger: MessageService,private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;
    let loadingRef: LoadingOverlayRef;
    // extend server response observable with logging
    Promise.resolve(null).then(() => loadingRef = this.loadingService.open());
    

    return next.handle(req).pipe(
      tap({
        // Succeeds when there is a response; ignore other events
        next: event => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
        // Operation failed; error is an HttpErrorResponse
        error: error => (ok = 'failed'),
      }),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
        this.messenger.add(msg);
        loadingRef.close();
      })
    );
  }
}
