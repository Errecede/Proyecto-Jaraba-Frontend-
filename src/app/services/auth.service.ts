import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

private apiURL = 'http://localhost:3000/auth'; //esto cambiaria si pongo la app en la nube por la ruta del server host.

  //Ver si hay token y sea valido.
  isAuthenticated = signal<boolean>(this.hasValidToken());
  private hasValidToken():boolean {
    const token = localStorage.getItem('token');
    if(!token) return false;

    try {
      const payloadBase64 = token.split('.')[1];
        if(!payloadBase64){
        return false;
        }

        //el decodificador
        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);

        if(!payload.exp){
          return false;
        }

        const expirationDate = payload.exp * 1000;
        const now = new Date().getTime();


        return now < expirationDate;


    } catch (error) {
      console.warn('Token invalido')
      localStorage.removeItem('token');
      return false;
    }





  }

  //hacer login
  login(credentials: {email: string, password: string}){
    return this.http.post<{token: string}>
    (`${this.apiURL}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);

        this.isAuthenticated.set(true);
      })
    )
  }

  //Registrar User
  register(userData: {name: string; email: string; password: string;}){
    return this.http.post(`${this.apiURL}/register`, userData);
  }


  //salir
  logout(){
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
