import 'hammerjs';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AppComponent }  from './app.component';
import { router } from './app.router';
import { StatusComponent } from './status/status.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    MaterialModule.forRoot(),
    router,
  ],
  declarations: [ 
    AppComponent,
    StatusComponent,
    SettingsComponent,
    AboutComponent,
    PageNotFoundComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }