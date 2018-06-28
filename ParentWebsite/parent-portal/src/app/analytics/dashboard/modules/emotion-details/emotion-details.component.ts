import { Component, OnInit , Input } from '@angular/core';
import { Emotion } from 'src/app/class/emotion';
import { Speeches } from 'src/app/class/speeches';

@Component({
  selector: 'app-emotion-details',
  templateUrl: './emotion-details.component.html',
  styleUrls: ['./emotion-details.component.css']
})
export class EmotionDetailsComponent implements OnInit {

  @Input() currentEmotion:Emotion;
  public speechDetails:string;
  constructor() { }

  ngOnInit() {
    var dataSet:Speeches = this.currentEmotion.$dataSet;
    this.speechDetails = dataSet.$speechDetails;
    
  }

}
