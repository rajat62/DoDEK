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