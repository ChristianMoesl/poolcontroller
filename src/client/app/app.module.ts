import 'hammerjs';
//import './Socket';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { RouterLink } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { AppComponent }  from './app.component';
import { router } from './app.router';
import { store } from './app.store';
import { StatusComponent } from './status/status.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    MaterialModule.forRoot(),
    router,
    store,
  ],
  declarations: [ 
    AppComponent,
    StatusComponent,
    SettingsComponent,
    AboutComponent,
    PageNotFoundComponent,
  ],
  providers: [
    SettingsService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }