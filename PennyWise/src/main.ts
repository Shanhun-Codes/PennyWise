import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppRoutesProvider } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

// Combine appConfig and AppRoutesProvider
const combinedConfig = {
  ...appConfig,
  providers: [...(appConfig.providers || []), ...AppRoutesProvider,
 provideHttpClient()],
};

bootstrapApplication(AppComponent, combinedConfig).catch(
  (err) => console.error(err)
);
