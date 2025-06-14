 import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes),
  provideHttpClient(),
  importProvidersFrom(NgbModule),
  provideHttpClient(withInterceptorsFromDi())
]
  
};
