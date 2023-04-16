import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserDetailsService } from 'src/app/services/user-details.service';

import { todos } from 'src/app/DefaultData/data';
import { categories } from 'src/app/DefaultData/categories';
import { HttpClient, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild("newproject") newproject :any;
  constructor(private user :UserDetailsService, private auth: AuthService, private http:HttpClient) { }

  ngOnInit(): void {
  }
  projectNames = this.user.projectNames
  username = this.auth.username;
  projectDetails= this.user.projectDetails;

  // Functions

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

    this.user.projects.push({categories: categories, projectData:todos, projectName:name, username:this.user.username})
    console.log(this.user.projects);

    // Adding to the databse

    const projectdata:any = {
      username: this.username, projectName: projectName, projectData: todos, categories: categories
    }

    this.http.post('http://localhost:3001/submitData',projectdata ).subscribe((res:any)=>{
      console.log(res);
    })
    
  }


  remove(item:any, i:number){
    this.user.removeProject(item,i);
    this.projectNames = this.user.projectNames;

    // const projectdata:any = {
    //   username: this.username, projectName: item
    // }

    const params = new HttpParams()
    .set("username", this.username)
    .set("projectName", item);
    
  
    this.http.delete('http://localhost:3001/deleteProject',{params} ).subscribe((res)=>{
      console.log(res);
    })

  }
}
