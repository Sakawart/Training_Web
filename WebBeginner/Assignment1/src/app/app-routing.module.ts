import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // นำเข้า HomeComponent
import { SampleComponent } from './sample/sample.component';
import { CommentComponent } from './comment/comment.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent }, // สร้าง route สำหรับ 'home'
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // ถ้าไม่มี path ให้ redirect ไปที่ home
  { path: 'sample', component: SampleComponent },
  { path: 'comment', component: CommentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // นำ routing เข้ามา
  exports: [RouterModule]
})
export class AppRoutingModule { }
