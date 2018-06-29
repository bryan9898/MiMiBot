import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Component, OnInit, ViewChild} from '@angular/core';

import { MatPaginator, MatTableDataSource, MatSort, MatPaginatorModule } from '@angular/material';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

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


}





export interface ModulesModel{
  ModuleId:string;
  ModuleName:string;
}


export interface Element {
 songName:any
 songLink:any

}


