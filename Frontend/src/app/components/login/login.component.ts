import { Component, OnInit } from '@angular/core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import {FormGroup, FormControl} from "@angular/forms"
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { connect, map, tap } from 'rxjs';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,private userDetails: UserDetailsService, private router :Router, private http :HttpClient) { }
  faLock = faLock;
  ngOnInit(): void {
    let isLoggedIn = this.authService.isAuthenticated();
    if(isLoggedIn){
      console.log(this.authService.loggedIn)
      this.router.navigate(['admin'])
    }
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })
  userData:any;
  projectData:any;

  async onSubmit(){
    
    const data:any = this.loginForm.value

    const params = new HttpParams()
  .set("username", data.username)
  .set("password", data.password);


   this.userData= await this.http.get('http://localhost:3001/login',{params} )
   console.log(this.userData);
   this.userData.subscribe((res:any)=>{
    
      this.authService.username = data.username;
      this.authService.password = this.loginForm.value.password;

      this.userDetails.projects = res.data;
      
      
      res.data.map((project:any)=>{
        this.userDetails.projectNames.push(project.projectName);
      })
      
      this.authService.login(); 
      this.router.navigate(['admin']);
    })

  }
}