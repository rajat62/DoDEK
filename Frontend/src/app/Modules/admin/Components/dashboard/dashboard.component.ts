
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { Router } from '@angular/router';

// Importing Sample Data

import { todos } from 'src/app/DefaultData/data';
import { categories } from 'src/app/DefaultData/categories';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  @ViewChild("newproject") newproject :any;


  constructor(private router: Router,private user : UserDetailsService, private authService : AuthService, private http :HttpClient) { }
  
  ngOnInit(): void {
  }
  
  username:any = this.authService.username;
  projectDetails= this.user.projectDetails;
  
  projects = this.user.projects.length;
  
  projectNames = this.user.projectNames;

  onSubmit() {
    const valueInput = this.newproject.nativeElement.value
    this.addProject(valueInput)
  }
  
  //  Loads the data of the project

  find = (item:any, i:number)=>{
    this.user.setProjectdata(item, i);
  }
  
  // For adding a new project

  addProject= (name:any)=>{
    

    let projectName:any = name;

    // Add to services

    
    this.user.projectNames.push(name);
    this.projectNames = this.user.projectNames;

    this.user.projects.push({categories: categories, projectData:todos, projectName:name, username:this.user.username, members:[]})
    console.log(this.user.projects);

    // Adding to the databse

    const projectdata:any = {
      username: this.username, projectName: projectName, projectData: todos, categories: categories
    }
    const newProject:any = {
      username: this.username, projectName: projectName
    }

    this.http.post('http://localhost:3001/submitData',projectdata ).subscribe((res)=>{
      console.log(res);
    })
    this.http.patch('http://localhost:3001/modifyUserData',newProject ).subscribe((res)=>{
      console.log(res);
    })
    this.projects=this.user.projects.length;
  }
  
  // Remove a project
  
  remove(item:any, i:number){
    this.user.removeProject(item,i);
    this.projectNames = this.user.projectNames;

    const params = new HttpParams()
    .set("username", this.username)
    .set("projectName", item);
    
  
    this.http.delete('http://localhost:3001/deleteProject',{params} ).subscribe((res)=>{
      console.log(res);
    })
    this.http.patch('http://localhost:3001/removeProject',{username: this.username, projectName: item} ).subscribe((res)=>{
      console.log(res);
    })
    this.projects=this.user.projects.length;
  }

  showMembers(item:string,i:number){
    this.user.showMembers(item,i);
    console.log(this.user.members)
  }
  name:string='';
  showAuthor(item:string,i:number){
    this.name = this.user.showAuthor(item,i);
    console.log(this.name);
  }
}
