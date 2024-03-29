import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Credentials } from '@apiModel/Credentials';
import { IUser } from '@apiModel/IUser';
import { CreateUserDto } from '@dto/CreateUserDto';
import { environment } from 'environments/environment';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getUser(): IUser | null{
    if(isPlatformBrowser(this.platformId)){
      var userData = sessionStorage.getItem('UserData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }
  setUser(user: IUser): Observable<boolean>{
    return this.http.get(environment.baseUrl + 'User/getContentInteractions' + user.id).pipe(
      tap(data => {
        if(isPlatformBrowser(this.platformId)){
          sessionStorage.setItem('UserData', JSON.stringify(user));
          sessionStorage.setItem('UserInteractions', JSON.stringify(data));
        }
      }),
      switchMap(() => this.http.get(environment.baseUrl + `User/getCreatedContent${user.id}`)),
      tap(data => {
        if(isPlatformBrowser(this.platformId))
          sessionStorage.setItem('UserCreatedContent', JSON.stringify(data));
      }),
      map(() => true)
    );
  }

  registerUser(userData: CreateUserDto): Observable<boolean>{
    return this.http.post(environment.baseUrl + 'User/createUser', userData, { responseType: 'text' }).pipe(
      map(data => {return data != null}),
      catchError(error => {
        if(error.status === 404)
          return throwError(() => new Error('Username already taken'));
        else
          return throwError(() => new Error('Something went wrong'))
      })
    );
  }

  loginUser(credentials: Credentials): Observable<any>{
    return this.http.post(environment.baseUrl + 'Auth/login', credentials).pipe(
      map(data => {return data}),
      catchError(error => {
            if (error.status === 404)
                return throwError(() => new Error('User not Found'));
            else
                return throwError(() => new Error('Something went wrong'));
        })
      );
  }

  logout(){
    sessionStorage.removeItem('UserData');
    sessionStorage.removeItem('UserInteractions');
  }
}
