import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component'
import { BuffermapComponent } from './buffermap/buffermap.component'
import { RoutemapComponent } from './routemap/routemap.component';
import { LayermapComponent } from './layermap/layermap.component';
import { SwipemapComponent } from './swipemap/swipemap.component';

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },
  { path: 'buffermap', component: BuffermapComponent},
  { path: 'routemap', component: RoutemapComponent},
  { path: 'layermap' , component: LayermapComponent},
  { path: 'swipemap' , component: SwipemapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
