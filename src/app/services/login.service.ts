import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserCredential } from "../security/user-credential";
import { AuthToken } from "../security/auth-token";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
  body: {},
  params: {}
};

const address = environment.URL + '/authc'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }

  doLogin(userCredential: UserCredential): Observable<AuthToken>{

    return this.httpClient.post<AuthToken>(address, userCredential, httpOptions);
  }
}