import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FirstCapsPipe } from './first-caps.pipe';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  declarations: [AppComponent, FirstCapsPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    AndroidPermissions,
    SplashScreen,
    TextToSpeech,
    BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: String, useValue: "dummy"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
