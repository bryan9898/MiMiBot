import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-keywords-details',
  templateUrl: './keywords-details.component.html',
  styleUrls: ['./keywords-details.component.css']
})
export class KeywordsDetailsComponent implements OnInit {

  @Input() currentMapping:Map<string,number>;
  public value:string;
  public count:Number;
  constructor() { }

  ngOnInit() {
    this.value = this.currentMapping[0];
    this.count = this.currentMapping[1];
    
  }

}
