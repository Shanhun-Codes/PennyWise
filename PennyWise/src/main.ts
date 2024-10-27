import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppRoutesProvider } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from './app/data.service';

// Combine appConfig and AppRoutesProvider
const combinedConfig = {
  ...appConfig,
  providers: [...(appConfig.providers || []), ...AppRoutesProvider,
 provideHttpClient(), DataService],
};

bootstrapApplication(AppComponent, combinedConfig).catch(
  (err) => console.error(err)
);
