import 'hammerjs';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent }  from './app.component';
import { MaterialModule } from '@angular/material';

const modules = [
  BrowserModule, 
  BrowserAnimationsModule, 
  MaterialModule.forRoot(),
];

@NgModule({
  imports: modules,
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }