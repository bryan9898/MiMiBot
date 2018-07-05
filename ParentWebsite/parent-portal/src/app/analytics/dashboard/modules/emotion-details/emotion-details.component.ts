import { Component, OnInit , Input } from '@angular/core';
import { Emotion } from 'src/app/class/emotion';
import { Speeches } from 'src/app/class/speeches';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';

@Component({
  selector: 'app-emotion-details',
  templateUrl: './emotion-details.component.html',
  styleUrls: ['./emotion-details.component.css']
})
export class EmotionDetailsComponent implements OnInit {

  @Input() currentEmotion:Emotion;
  public speechDetails:string;
  public currentColor:string;
  public oneTrue;
  public twoTrue;
  public threeTrue;
  public fourTrue; 
  public fiveTrue; 
  public sixTrue;
  private analyticsService:AnalyticsService;
  constructor(private as:AnalyticsService) { 
    this.analyticsService = as;
  }

  ngOnInit() {
    var dataSet:Speeches = this.currentEmotion[0].$dataSet;
    this.speechDetails = dataSet.$speechDetails;
    this.setColour(this.currentEmotion[1]);
    
    
  }

  setColour(colour)
  {
    this.oneTrue = false; 
    this.twoTrue = false; 
    this.threeTrue = false; 
    this.fourTrue = false; 
    this.fiveTrue = false; 
    this.sixTrue = false; 

    if(colour == "#ED5565")
    {
      this.oneTrue = true;
    }
    else if(colour == "#FC6E51")
    {
      this.twoTrue = true;
    }
    else if(colour == "#FFCE54")
    {
      this.threeTrue = true;
    }
    else if(colour == "#48CFAD")
    {
      this.fourTrue = true;
    }
    else if(colour == "#4FC1E9")
    {
      this.fiveTrue = true;
    }
    else if(colour == "#AC92EC"){
      this.sixTrue = true;
    }
  }



  showDetails(){
    this.analyticsService.setCurrentEmotionIndStatus(true);
    this.analyticsService.setCurrentEmotionIndDataset(this.currentEmotion[0]);
  }
}
