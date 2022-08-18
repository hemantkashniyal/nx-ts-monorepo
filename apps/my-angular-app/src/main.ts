import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { clientLib } from '@myapp/client-lib';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log(clientLib())

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
