import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './teacher/home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { StudentsComponent } from './teacher/students/students.component';
import { ReportsComponent } from './teacher/reports/reports.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: "", redirectTo: '/sign-in', pathMatch: 'full' },
  { path: "sign-in", component: SignInComponent,  },
  { path: "teacher/home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "teacher/students", component: StudentsComponent, canActivate: [AuthGuard] },
  { path: "teacher/reports", component: ReportsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
