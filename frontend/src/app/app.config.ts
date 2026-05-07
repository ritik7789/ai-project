import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { apiInterceptor } from './core/interceptors/api.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right'
    })
  ]
};
