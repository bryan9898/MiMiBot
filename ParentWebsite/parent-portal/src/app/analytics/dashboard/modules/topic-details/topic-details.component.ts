import { Component, OnInit , Input } from '@angular/core';
import { Speeches } from 'src/app/class/speeches';
import { Emotion } from 'src/app/class/emotion';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.css']
})
export class TopicDetailsComponent implements OnInit {

  @Input() emotion:Emotion;
  private speech:Speeches;
  private tags: string; 
  private sentence:string;
  constructor() { }

  ngOnInit() {
    var base = "";
    var i = 0; 
    this.speech = this.emotion.$dataSet;
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
