import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { AuthGoogleService } from './auth-google.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private token:any;
  
  public user = new BehaviorSubject<any>(null);

  constructor(private http:HttpClient,
    private authService:AuthGoogleService
  ) {
    this.token = `${sessionStorage.getItem('my_token')}`;
    effect(() => {
      let profile = this.authService.getProfile();
      if(profile !== null) {
        this.user.next({
          fullName: profile.name,
          email: profile.email,
          picture: profile.picture
        })
      }
    })
  }

  claimDbUser(user:any) {
    return this.http.post(`${this.baseUrl}/login`, user)
  }

  getAllUsers(id: number) {
    return this.http.get(`${this.baseUrl}/get-all-users?userId=${id}`)
  }

  logout(user:any) {
    return this.http.post(`${this.baseUrl}/logout`, user)
  }
}
