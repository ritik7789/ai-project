import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NotificationService } from '../services/notification.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);
  const url = isAbsoluteUrl ? req.url : `${environment.apiBaseUrl}${req.url}`;

  const updatedRequest = req.clone({
    url,
    setHeaders: {
      Accept: 'application/json'
    }
  });

  return next(updatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const detail =
        typeof error.error?.detail === 'string'
          ? error.error.detail
          : 'Something went wrong while calling the API.';

      if (error.status >= 400) {
        notification.error(detail);
      }

      return throwError(() => error);
    })
  );
};
