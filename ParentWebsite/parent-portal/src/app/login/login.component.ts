import { Component, OnInit, Injectable } from '@angular/core';
import { Users } from '../class/users';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest} from '@angular/common/http';
import { MatHorizontalStepper } from '@angular/material';
import { Observable } from 'rxjs';
import { utf8Encode } from '@angular/compiler/src/util';
import {Router} from '@angular/router';
import { TokenService } from 'src/app/login/token.service';

@Injectable()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  checkValid(): any {
    if(this.model.$Username == null || this.model.$Password == null)
    {
      this.invalid = true;
    }

    if(this.model.$Username.length == 0 || this.model.$Password.length == 0)
    {
      this.invalid = true;
    }

  }
  readonly ROOT_URL = "https://mimiwebserver.azurewebsites.net/api";
  constructor(private http: HttpClient, routerS: Router , tks: TokenService) { 
    this.router = routerS;
    this.tks = tks;
  }
  
  private token : string;
  model = new Users(); 
  public invalid = false;
  private errorMsg = "hello";
  public routerLinkDetails = "/login";
  private router;
  private tks;

  ngOnInit() {
    this.tks.clearStorage();
  }
  
  async login()
  {
        try{
          this.checkValid();
        }
        catch(ex)
        {
          console.log("invalid");
        }
        try{
          var token = await this.checkLogin(this.model);
          if(token == null)
          {
            this.invalid = true;
          }
          else {
            this.invalid = false;
            this.tks.setCurrentToken(token);
            await this.tks.setCurrentUser(this.model.$Username);
            this.router.navigateByUrl("/home");
          }
        }
        catch(ex)
        {
          console.log(this.model.$Password);
          console.log("Exception in saving");
        }
        
  }

   username: string;
   password: string;

  async checkLogin(model)
  { 
      console.log(this.model.$Username);
      this.username = this.model.$Username; 
      this.password= this.model.$Password;
      console.log(this.model.$Password);
      var headerss = new HttpHeaders({
        'Content-Type' : 'application/json',
        'response-Type': 'XML/http',
        'Authorization': 'Basic ' + btoa(this.username + ":" + this.password)
      });
      // var token = await this.http.post(this.ROOT_URL + '/Users/token' ,  "123" ,  {headers:headerss , responseType: 'text' }).toPromise();
      return "Test";
      
     
   
  }

  
      
}

  
