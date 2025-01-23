import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SigninInfo } from '../core/auth/models/auth.models';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  env = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }
  login(loginInfo: SigninInfo): Observable<any> {
    return this.http.post(`${this.env}/login`, loginInfo);
  }
}
