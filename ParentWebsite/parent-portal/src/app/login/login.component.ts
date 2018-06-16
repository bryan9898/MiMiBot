import { Component, OnInit, Injectable } from '@angular/core';
import { Users } from '../class/users';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest} from '@angular/common/http';
import { MatHorizontalStepper } from '@angular/material';
import { Observable } from 'rxjs';
import { utf8Encode } from '@angular/compiler/src/util';


@Injectable()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  constructor(private http: HttpClient) { }
  private token : string;
  public model = new Users(); 
  private invalid = false;
  private errorMsg = "hello";
  
  ngOnInit() {

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
        var token = await this.checkLogin(this.model);
        if(token == null)
        {
          this.invalid = true;
        }
        else {
          this.invalid = false;
        }
  }

  private async checkLogin(model)
  { 
      console.log(this.model.$Username);
      let username: string = this.model.$Username; 
      let password: string = this.model.$Password;
      var headerss = new HttpHeaders({
        'Content-Type' : 'application/json',
        'response-Type': 'XML/http',
        'Authorization': 'Basic ' + btoa(username + ":" + password)

      });
      try{
        var token = await this.http.post(this.ROOT_URL + '/Users/token' ,  "123" ,  {headers:headerss , responseType: 'text' }).toPromise().catch(
          e => {
            console.log("bad request");
          }
          );
      return token;
          
      }
      catch(ex)
      {
        
      }
     
   
  }

  
      
}

  
