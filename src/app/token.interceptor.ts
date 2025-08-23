import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from './app.config';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const httpClient = inject(HttpClient);
  const baseUrl = inject(BASE_API_URL); // ✅ fixed (removed private)

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Attempt to refresh token
        return httpClient.post(`${baseUrl}/api/refresh`, {}).pipe(
          switchMap(() => {
            // Retry the original request
            return next(req);
          }),
          catchError(() => {
            // If refresh fails, propagate error
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
