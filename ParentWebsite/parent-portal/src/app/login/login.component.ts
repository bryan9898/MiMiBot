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
  public model = new Users(); 
  private invalid = false;
  private errorMsg = "hello";
  private routerLinkDetails = "/login";
  private router;
  private tks;

  ngOnInit() {
    this.tks.clearStorage();
  }
  
  private async login()
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

  private async checkLogin(model)
  { 
      console.log(this.model.$Username);
      let username: string = this.model.$Username; 
      let password: string = this.model.$Password;
      console.log(this.model.$Password);
      var headerss = new HttpHeaders({
        'Content-Type' : 'application/json',
        'response-Type': 'XML/http',
        'Authorization': 'Basic ' + btoa(username + ":" + password)
      });
      // var token = await this.http.post(this.ROOT_URL + '/Users/token' ,  "123" ,  {headers:headerss , responseType: 'text' }).toPromise();
      return "Test";
      
     
   
  }

  
      
}

  
