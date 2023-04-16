import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { computeStyles } from '@popperjs/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  refreshUsers$ = new BehaviorSubject<boolean> (true);
  constructor(private http:HttpClient, private auth : AuthService) { }

  username = this.auth.username;
  projectDetails:any;
  categories:any;
  projects:any=[];
  projectNames:any=[];
  
  projectNumber:any;
  members:string[]=[];

  setProjectdata(item:any, i:number){
  
      this.projectDetails = this.projects[i].projectData;
      this.categories = this.projects[i].categories;
      this.projectNumber=i;
      this.members = this.projects[i].members;
      console.log(this.projectDetails);
    }
    
  removeProject(item:any, i:number){
      const removed = this.projects.filter((val:any, index:any)=> (val.projectName !== item)  );
      const remainingNames = this.projectNames.filter((val:any, index:any)=> (val !== item)  );
      this.projects=removed;
      this.projectNames=remainingNames;
    }
    
  updatecategory(newCategory:any){
    this.projects[this.projectNumber].categories.push(newCategory);
    console.log(this.projects[this.projectNumber].categories);
    this.categories = this.projects[this.projectNumber].categories;
  }
  
  addNewTodo(newTodo:any){
    this.projects[this.projectNumber].projectData.push(newTodo);
    console.log(this.projects[this.projectNumber].projectData);
    this.projectDetails = this.projects[this.projectNumber].projectData;
  }
  
  removeTodo(todo:any){
    const removed = this.projects[this.projectNumber].projectData.filter((val:any, index:any)=> (val.name !== todo.name)  );
    this.projects[this.projectNumber].projectData=removed;
    this.projectDetails = this.projects[this.projectNumber].projectData;
  }
  showMembers(item:string, i:number){
    this.members = this.projects[i].members;
  }
  showAuthor(item:string, i:number){
    return this.projects[i].username;
  }

  sendTodo(){
    return this.projectDetails
  }
  sendCategories(){
    return this.categories
  }

  addMemberToService(memberName:string){
    this.projects[this.projectNumber].members.push(memberName);
    console.log(this.projects[this.projectNumber]);
  }
  removeMemberFromService(memberName:string){
    this.members = this.projects[this.projectNumber].members.filter((val:any)=> (val !== memberName)  );
    console.log(this.members)
  }

  updateDesc(name:string, desc:string){
    
    console.log(desc)
    this.projectDetails.forEach((x:any, index:any) => {
      if(x.name == name) {
        this.projectDetails[index] = {name:x.name, category:x.category, des:desc}
      }
    })

    console.log(this.projectDetails)
    
  }

}
