import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort, MatPaginatorModule } from '@angular/material';
import {URLSearchParams, QueryEncoder} from '@angular/http';
@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css'],
})
export class UploadsComponent implements OnInit {

  panelOpenState = false;
  
  private ELEMENT_DATA: Element[] = [
   
  ];

  private ModuleID: string;
  page: number = 1;
  private http;
  private length = this.ELEMENT_DATA.length;
  private pageSize = 4;
  private pageSizeOptions = [4];

  // MatPaginator Output






  displayedColumns = ['songName', 'songLink'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  //current Teacher and class MoDULE info
 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  ngOnChanges() {

  }

  constructor() {


  }

  private x: number = 0;

  private currentModuleName: Array<ModulesModel> = new Array<ModulesModel>();
  async ngOnInit() {
  
      
            //this.ELEMENT_DATA.push({ModuleID: this.ModuleSet[this.x].ModuleId , ModuleName: this.currentModuleName['ModuleName'] , ModuleClass: this.ModuleSet[this.x].ClassDefaultId});
           this.ELEMENT_DATA.push({songName:"abc",songLink:"cde"})
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        
            }
  

  



 

  tableClick(event: any): void {

  //  this._sharedService2.emitChange(event.ModuleID + ";" + event.ModuleName + ";" + event.ModuleClass);
  }


  async submitSong(){
    var bearer = {
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }

    var sentData = await this.http.post("https://mimiwebserver.azurewebsites.net/api/Uploads",{bearer}).toPromise();
 
    
  }


  async testing() {
    var bearer = {
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }
    

    var results = await this.http.get("" , {bearer}).toPromise();
   
    results.forEach(e => {
      
    })

    return null;
  }

}





export interface ModulesModel{
  ModuleId:string;
  ModuleName:string;
}


export interface Element {
 songName:any
 songLink:any

}


