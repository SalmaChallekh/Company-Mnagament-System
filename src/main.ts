import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeFrTN from '@angular/common/locales/fr-TN';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
registerLocaleData(localeFrTN);

bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
        ...appConfig.providers!,
        importProvidersFrom(BrowserAnimationsModule),  // ✅ Add this
    ]
}).catch(err => console.error(err));

