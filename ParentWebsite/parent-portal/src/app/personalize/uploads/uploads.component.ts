import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Component, OnInit, ViewChild , Inject, Injectable,Input , EventEmitter } from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort, MatPaginatorModule } from '@angular/material';
import {URLSearchParams, QueryEncoder} from '@angular/http';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css'],
})
export class UploadsComponent implements OnInit {

  panelOpenState = false;
  
  private ELEMENT_DATA: Element[] = [
   
  ];

  
  /** The upload config */
  config: UploadConfig
  /** The selected file */
  currentFile: File
  /** The current percent to be displayed */
  percent: number
  private ModuleID: string;
  page: number = 1;
  //private http;
  private length = this.ELEMENT_DATA.length;
  private pageSize = 4;
  private pageSizeOptions = [4];

  // MatPaginator Output



   upload :any ={} ;

    Config: UploadParams = {
    sas: '?sv=2017-11-09&ss=b&srt=sco&sp=rwdlac&se=2018-07-31T05:04:11Z&st=2018-06-30T21:04:11Z&spr=https,http&sig=Fn8J7MZV%2Baf8E5nbldAPW0DckfRPwglPPc96VQ4HTHs%3D',
    storageAccount: 'mimibotupload',
    containerName: 'uploads'
  };
  
    @Input('songName') InputId = this.upload.songName;
    @Input('songLink') InputName = this.upload.songLink ;


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

  constructor(private http:HttpClient,private blob: BlobService) {
    

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
 
  private fileList;

  fileChange(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length > 0) {
        let file: File = fileList[0];
        this.currentFile = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
       // let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        //headers.append('Content-Type', 'multipart/form-data');
      //  headers.append('Accept', 'application/json'); */
       /* let options = new RequestOptions({ headers: headers });
        this.http.post(`${this.apiEndPoint}`, formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            ) */
    } 
  } 

  async submitSong(){
    var bearer = {
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }

    var id = Math.floor(Math.random() * 9999999999) + Math.floor(Math.random() * 9999999999);
    const baseUrl = this.blob.generateBlobUrl(this.Config, this.upload.songName)
    this.config = {
      baseUrl: baseUrl,
      blockSize: 1024 * 32,
      sasToken: this.Config.sas,
      file: this.currentFile,
      complete: () => {
        console.log('Transfer completed !')
      },
      error: () => {
        console.log('Error !')
      },
      progress: (percent) => {
        this.percent = percent
      }
    }
    this.blob.upload(this.config)
  }
    //var sentData = await this.http.post("",{bearer}).toPromise();
  /*  var sentData = await this.http.post("https://mimiwebserver.azurewebsites.net/api/Uploads", JSON.stringify({uploadId: id.toString()   , password:this.upload.songName,userId:"string"}), { headers: bearer })
      .map(res => res.json()) */
    
  


  async testing() {
    var bearer = {
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }
    

   /* var results = await this.http.get("" , {bearer}).toPromise();
   
    results.forEach(e => {
      
    }) */

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


