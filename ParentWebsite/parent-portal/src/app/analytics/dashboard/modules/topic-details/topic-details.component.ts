import { Component, OnInit , Input } from '@angular/core';
import { Speeches } from 'src/app/class/speeches';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.css']
})
export class TopicDetailsComponent implements OnInit {

  @Input() speech:Speeches;
  private tags: string; 
  private sentence:string;
  constructor() { }

  ngOnInit() {
    console.log(this.speech);
    var base = "";
    var i = 0; 
    this.speech.$topics.forEach(t => 
    {
      i++; 
      if(i == this.speech.$topics.length)
      {
        var tag = t;
      }
      else {
        var tag = t + " , ";
      }
      base = base + tag; 
    })
    this.tags = base;
    this.sentence = this.speech.$speechDetails;
  }

}
