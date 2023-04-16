import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {todos} from "../../DefaultData/data";
import { categories } from 'src/app/DefaultData/categories';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  faUser = faUser;
  constructor(private router: Router, private http:HttpClient) { }

  registerForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })
  ngOnInit(): void {
  }

  onSubmit(){
    
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
      
    const userdata:any = {
      username: username, password:password, projects: ["sample"], projectName:"sample", projectData: todos, categories: categories
    }

    this.http.post('http://localhost:3001/post',userdata ).subscribe((res)=>{
      console.log(res);
    })
    this.router.navigate(['login']);
    
  }
}
