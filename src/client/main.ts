import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));

/*
 *  Do hot module reloading if enabled. 
 */
const m: any = module;
if (m.hot) {
    m.hot.accept();
}