import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmlJson } from 'src/services/xml-json.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    XmlJson,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
