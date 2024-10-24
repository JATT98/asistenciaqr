import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
declare var mobileMenuObj: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  firstName: string = '';

  user: any;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) { }


  ngOnInit(): void {
    this.user = this.localStorage.retrieve("userData");
    console.log(this.user);
    if (this.user) {
      this.firstName = this.user?.firstName
    }
    mobileMenuObj.func1();
  }

  logout(): void {
    this.localStorage.clear('jwtToken');
    this.localStorage.clear('userData');
    this.router.navigate(['/sign-in']);
  }
}
