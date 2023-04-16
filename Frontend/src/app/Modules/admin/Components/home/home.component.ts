import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, switchMap } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService : AuthService, private userDetails: UserDetailsService, private http:HttpClient) { }

  @ViewChild("nameField") nameField: any; 
  @ViewChild("textArea") textArea: any; 
  @ViewChild("member") member: any; 
  @ViewChild("categoryField") categoryField: any; 
  @ViewChild("descField") descField: any; 
  @ViewChild("selectedValue") selectedValue: any; 
  @ViewChild("newCategory") newCategory: any; 
  @ViewChild('outerBox') outerBox:any;
  
  faPencil = faPencil;
  title = 'doDek';
  
  // Initial Data

  todos:any;
  // Initial Categories
  
  categories = this.userDetails.sendCategories();

  // Initial Data Loading

  ngOnInit(): void {
      this.todos = this.userDetails.sendTodo();
      this.categories = this.userDetails.sendCategories();
      console.log(this.categories);
      this.filterValues();
  }
  
  
  // Username 

  username  = this.authService.username;

  newTodos:any;
  removedCategoryIndex:any;

  // Adding a new member
  memberName:string="";
  memberNameChange(e:any){
    this.memberName = e.target.value;
  }
  addMember(){
    let projectName  = this.userDetails.projects[this.userDetails.projectNumber].projectName;
    
    this.userDetails.addMemberToService(this.memberName);

    try{
      this.http.patch('http://localhost:3001/addMember',{memberName: this.memberName, projectName:projectName, username:this.username} ).subscribe((res)=>{
        if(res==="user does not exist"){
          alert("user does not exist");
        }
        else{
          
        }
      })
    }catch(err){
      console.log(err);
      
    }

  }
  removeMember(){
    // let projectName  = this.userDetails.projects[this.userDetails.projectNumber].projectName;
    console.log(this.memberName)
    this.userDetails.removeMemberFromService(this.memberName);
    this.member= this.userDetails.members;

    let projectNumber = this.userDetails.projectNumber;
    let projects = this.userDetails.projects;
    try{
      this.http.patch('http://localhost:3001/removeMember',{memberName: this.memberName, projectName: projects[projectNumber].projectName, username:this.username} ).subscribe();


    }catch(err){
      console.log(err);
      
    }
    console.log(this.member);
  }
  
  filterValues (){
    
    this.newTodos = this.categories.map((data:any)=> 
    this.todos.filter((val:any)=>  val.category === data));
    
    this.newTodos.map((data:any, index:number)=> 
    { 
      if(data.length==0)
        { 
          this.removedCategoryIndex =  index
          this.categories.splice(this.removedCategoryIndex,1);
        } 
      }
      );
      
      this.newTodos =  this.newTodos.filter((data:any)=> data.length !=0 )

    }
   
    // Adding new Category

    newCategoryName="";
    getCategoryName(e:any){
      this.newCategoryName = e.target.value;
    }
  
    addNewCategory(){
      this.userDetails.updatecategory(this.newCategoryName);
      console.log(this.userDetails.categories);
      this.categories=this.userDetails.categories;
      this.todos.push({
        name: this.newCategoryName,
        category: this.newCategoryName,
        des: "it's a dummy para"
      });
      
      this.filterValues();

    }

  // Calling Initially to make columns of categories

 


  task: string ="";
  cat:string= "";
  name:string= "";
  description:string= "";
  myValue="";


  nameChange(e:any){
    this.name = e.target.value;
  }
 
  descChange(e:any){
    this.description = e.target.value;
  }
  getSelectedValue(e:any){
    this.cat =e.target.value;
  }

  // Adding data to columns

  addValues(){
    const obj = {
      name: this.name,
      category: this.cat,
      des: this.description
    }

    this.userDetails.addNewTodo(obj);
    this.todos= this.userDetails.projectDetails;
    this.filterValues();
    this.nameField.nativeElement.value="";
    this.descField.nativeElement.value =""; 
    this.categoryField.nativeElement.value="";
    
  }
  
  // Removing particular todo

  remove(data:any, i:number){
    // const removed = this.todos.filter((val:any, index:any)=> (val.name !== data.name)  );
    this.userDetails.removeTodo(data);
    // this.userDetails.projectDetails=removed;
    this.todos=this.userDetails.projectDetails;
    this.filterValues();
  }

  


  starting:any; // Selecting moving todo

  dragStart(e:any){
    this.starting= e.target;
    console.log(this.starting.children[1].innerText)
  }

  Drop(e:any){

    if(this.categories.some((className: any) =>e.target.parentNode.classList.contains(className))){
      const containClass = e.target.parentNode.children[0].innerText;
      console.log("yes it contains");
      this.todos.map((data:any, index:any)=> {
        if(data.name === this.starting.children[1].innerText){ 
          data.category=containClass.toLowerCase();
        }
      }
      )
    }
    else{
      this.filterValues();
      // this.modifytodos();
    }
    this.filterValues();
    // this.modifytodos();
    
  }

  mouseMove(e:any){
    e.preventDefault();
    this.outerBox.nativeElement.scrollLeft += e.deltaY;
  }

  // Edit Option

  show:boolean=false;

  dataDescription = "";
  dataName="";
  showData(data:any, i:number){
    if(this.show){
      this.show =false;
    }
    else{
      this.show =true;
      console.log(data);
      this.dataDescription = data.des;
      this.dataName = data.name;
    }
  }

  hideEdit(){
    this.show=false;
  }
  updatedValue:any="";
  updateTextArea(e:any){
    this.updatedValue =e.target.value;
  }
  updateDesc(){
    this.userDetails.updateDesc(this.dataName, this.updatedValue);
    this.todos= this.userDetails.projectDetails;
    this.show=false;
  }
}
