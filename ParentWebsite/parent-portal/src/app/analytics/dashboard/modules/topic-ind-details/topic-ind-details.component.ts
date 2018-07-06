import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-topic-ind-details',
  templateUrl: './topic-ind-details.component.html',
  styleUrls: ['./topic-ind-details.component.css']
})
export class TopicIndDetailsComponent implements OnInit {
  
  
  @Input() currentMapping:Map<string,number>;
  public value:string;
  public count:Number;
  constructor() { }

  ngOnInit() {
    this.value = this.currentMapping[0];
    this.count = this.currentMapping[1];
    
  }

}
