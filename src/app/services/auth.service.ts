import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API ='http://192.180.2.159:4040/swagger/index.html'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/Auth/UserLogin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(firstName: string,  lastName: string, email: string, password: string,phone:number,dateOfBirth:string): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/RegisterUser',
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

}
