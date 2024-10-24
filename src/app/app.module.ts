import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './teacher/home/home.component';
import { AttendanceComponent } from './teacher/attendance/attendance.component';
import { NavbarComponent } from './teacher/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from "./toast/toast.component";
import { NgxWebstorageModule } from "ngx-webstorage";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentsComponent } from './teacher/students/students.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Result, Exception } from '@zxing/library';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { ReportsComponent } from './teacher/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    AttendanceComponent,
    NavbarComponent,
    ToastComponent,
    StudentsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxWebstorageModule.forRoot({
      prefix: "cti",
      separator: "-",
      caseSensitive: true,
    }),
    BrowserAnimationsModule,
    NgSelectModule,
    ZXingScannerModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
