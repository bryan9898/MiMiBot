import { Injectable , EventEmitter } from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest} from '@angular/common/http';
import { Users } from 'src/app/class/users';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  readonly ROOT_URL = "https://mimiwebserver.azurewebsites.net/api";
  private currentUserName: string; 
  public cu: Users;
  private bearer = {
    'Content-Type' : 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
  }

  constructor(private http: HttpClient) { }

  public getCurrentToken()
  {
    return sessionStorage.getItem("token");
  }

  public setCurrentToken(value)
  {
    sessionStorage.setItem("token" , value);
  }

  public clearStorage()
  {
    var cleared = false;
    try{
      sessionStorage.clear();
      localStorage.clear();
      cleared = true;
      return cleared
    }
    catch(ex)
    {
      cleared = false;
      return cleared;
    }
    
  }

  public async setCurrentUser(userName)
  {
    var user = await this.http.get(this.ROOT_URL + '/Users/' + userName  ,  {headers:this.bearer}).toPromise();
    this.cu = this.convertToCurrentUser(user);
  }

  private convertToCurrentUser(user)
  {
    var cu = new Users();
    cu.$Username = user.userId;
    cu.$Password = user.password; 
    cu.$Name = user.name;
    return cu; 
  }

  
 



}
