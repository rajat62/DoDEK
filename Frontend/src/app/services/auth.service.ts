import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  username:any=""; 
  password:any=""; 
  constructor() { }

  loggedIn= false;

  login(){
    this.loggedIn =true;
  }
  logout(){
    this.loggedIn=false;
  }

  isAuthenticated(){
    return this.loggedIn;

  }
}
