import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services/toast/toast.service';
import { LocalStorageService } from "ngx-webstorage";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  user: string = '';
  password: string = '';

  bgImage: string = '';

  ngOnInit(): void {
    const n = Math.floor(Math.random() * 3) + 1;
    this.bgImage = n.toString();
  }

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toast: ToastService,
    private localStorage: LocalStorageService

  ) {}

  login(): void {
    this.http.post<any>( environment.URLBACKEND + '/login', { email: this.user, password: this.password })
      .subscribe(
        response => {
          const { token, userData } = response;
          this.localStorage.store("jwtToken", token);
          this.localStorage.store("userData", userData);
          this.router.navigate(['/teacher/home']);
        },
        error => {
          console.error('Login error', error);
          this.toast.showError('Error al iniciar sesión. Por favor, verifique sus credenciales.');
        }
    );
  }
}
