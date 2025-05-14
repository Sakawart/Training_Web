import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BuffermapComponent } from './buffermap/buffermap.component';
import { RoutemapComponent } from './routemap/routemap.component';
import { LayermapComponent } from './layermap/layermap.component';
import { SwipemapComponent } from './swipemap/swipemap.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    BuffermapComponent,
    RoutemapComponent,
    LayermapComponent,
    SwipemapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
