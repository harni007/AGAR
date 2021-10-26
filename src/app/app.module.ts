import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { Gamev2Component } from './gamev2/gamev2.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    Gamev2Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
