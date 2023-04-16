import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private auth:AuthService,private http : HttpClient, private router :Router, private userDetails: UserDetailsService) { }

  ngOnInit(): void {
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['login']);
    this.userDetails.username = "";
    this.userDetails.projectDetails={};
    this.userDetails.categories=[];
    this.userDetails.projects=[];
    this.userDetails.projectNames=[];

  }
    
  updateDB(){
    
    let todos = this.userDetails.projectDetails;
    let projectName = this.userDetails.projectNames[this.userDetails.projectNumber];
    let categories = this.userDetails.projects[this.userDetails.projectNumber].categories;

    let todobody:any = {
        username: this.auth.username, todos:todos, projectName:projectName, categories:categories
      }

      console.log(todobody)

      this.http.put("http://localhost:3001/addTodo", todobody).subscribe((res:any)=>{
        console.log(res);
      })
      
  }
}
