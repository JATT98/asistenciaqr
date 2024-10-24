import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, EMPTY} from 'rxjs';
import { SessionStorageService, LocalStorageService } from "ngx-webstorage";
import {AuthToken} from "../../security/auth-token";
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { Router } from '@angular/router';
import { ActualUser } from 'src/app/model/actual-user';
import { UserPreferences } from 'src/app/model/user-preferences';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
  body: {},
  params: {
    email: undefined
  }
};

@Injectable({
  providedIn: 'root'
})
export class ActualUserService {

  address = environment.URL + '/actual-user'

  private dataSource = new BehaviorSubject(new ActualUser());
  currentData = this.dataSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    private sessionStorage: SessionStorageService,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }

  updateActualUser(admPerson: ActualUser) {
    this.dataSource.next(admPerson);
  }

  getCurrentData(): Observable<ActualUser>{
    const authToken = this.localStorage.retrieve(UserPreferences.Auth);

    if(!authToken){
      return EMPTY;
    }

    const helper = new JwtHelperService();
    const token = helper.decodeToken(authToken.authc);

    httpOptions.params.email = token.sub;
    return this.httpClient.get<ActualUser>(this.address, httpOptions)
  }

  setToken(authToken: AuthToken) {
    this.localStorage.store(UserPreferences.Auth, authToken);
  }

  logout(){
    this.clearToken();
    this.router.navigate(['/']);
  }

  //validation to allow access
  isAuthenticated(role = undefined): boolean {
    const authToken = this.localStorage.retrieve(UserPreferences.Auth);
    if(authToken !== undefined && authToken !== null){
      const helper = new JwtHelperService();
      if(helper.isTokenExpired(authToken.authc)){
        this.clearToken();
        return false;
      }

      const token = helper.decodeToken(authToken.authc);
      if(role){
        let roles = token.groups;
        for (const item of roles) {
          if(item.toLowerCase() === role.toLowerCase()){
            return true;
          }
        }
        return false;
      }
      return true;
    }
    return false;
  }

  //validation to redirect
  isAuthenticatedWithRol(){
    const authToken = this.localStorage.retrieve(UserPreferences.Auth);
    if(authToken !== undefined && authToken !== null){
      const helper = new JwtHelperService();
      if(helper.isTokenExpired(authToken.authc)){
        this.clearToken();
        return undefined;
      }

      const token = helper.decodeToken(authToken.authc);
      return token.groups[0];
    }
    return undefined;
  }

  clearToken(){
    this.localStorage.clear(UserPreferences.Auth);
  }

}
