import { Component, OnInit , Input } from '@angular/core';
import { Speeches } from 'src/app/class/speeches';
import { Emotion } from 'src/app/class/emotion';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';

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
  public oneTrue;
  public twoTrue;
  public threeTrue;
  public fourTrue; 
  public fiveTrue; 
  public sixTrue;
  private analyticService:AnalyticsService;
  constructor(as:AnalyticsService) {
    this.analyticService = as;
   }

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
    this.analyticService.currentColor.subscribe(data => {
      this.setColour(data);
    });
  }

  setColour(colour)
  {
    this.oneTrue = false; 
    this.twoTrue = false; 
    this.threeTrue = false; 
    this.fourTrue = false; 
    this.fiveTrue = false; 
    this.sixTrue = false; 

    if(colour == "0")
    {
      this.oneTrue = true;
    }
    else if(colour == "1")
    {
      this.twoTrue = true;
    }
    else if(colour == "2")
    {
      this.threeTrue = true;
    }
    else if(colour == "3")
    {
      this.fourTrue = true;
    }
    else if(colour == "4")
    {
      this.fiveTrue = true;
    }
    else if(colour == "5"){
      this.sixTrue = true;
    }
  }

  loadDetails(event)
  {
    this.analyticService.setCurrentTopicStatus(true);
    this.analyticService.setCurrentTopicData(this.emotion);
  }
}
