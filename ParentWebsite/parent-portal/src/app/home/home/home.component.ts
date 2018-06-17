import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/login/token.service';
import {Users } from 'src/app/class/users';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  private user = "tom";  
  private loaded:Boolean = false;
  private tks:TokenService;
  private router;
  public toggled = true;
  constructor(tks:TokenService , router:Router) { 
   this.tks = tks;
   this.router = router;
  }
  ngOnInit() {
    try{
      this.user = this.tks.cu.$Name;
    }
    catch(ex)
    {
      // this.router.navigateByUrl("/");
    }
  }

  toggleNavBar()
  {
    if(this.toggled == true)
    {
      this.toggled = false;
      console.log("close");
    }
    else if(this.toggled == false)
    {
      this.toggled = true;
    }
    else {
      console.log("erro");
    }
  }

 
}
