import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { UsermapComponent } from './usermap/usermap.component'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'gis',
    loadChildren: () => import('./gis/gis.module').then((m) => m.GisModule),
    data: {
      systemId: 'GIS',
    },
  },
  {
    path: 'usermap',
    component: UsermapComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
