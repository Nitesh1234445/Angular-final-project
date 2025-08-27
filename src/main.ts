import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

console.log('[main] bootstrapping...');
bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('[main] bootstrapped OK'))
  .catch(err => console.error('[main] bootstrap error', err));
