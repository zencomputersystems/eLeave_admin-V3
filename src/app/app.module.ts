import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule, Http } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmlJson } from '../../src/services/shared-service/xml-json.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found.component';
import { SideMenuNavigationModule } from './side-menu-navigation/side-menu-navigation.module';
import { LoginModule } from './login/login.module';
import { WorkingHourConfigComponent } from './admin-setup/general-component/working-hour-config/working-hour-config.component';
import { ConfirmationWindowComponent } from './global/confirmation-window/confirmation-window.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, WorkingHourConfigComponent, ConfirmationWindowComponent],
  entryComponents: [WorkingHourConfigComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    // BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot({mode: 'md'}),
    AppRoutingModule,
    LoginModule,
    SideMenuNavigationModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    XmlJson,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


const provider = [
  StatusBar,
  SplashScreen,
  XmlJson,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
];

@NgModule({})
export class App2SharedModule{
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: provider
    }
  }
}