import { Component, OnInit , Input } from '@angular/core';
import { Emotion } from 'src/app/class/emotion';

@Component({
  selector: 'app-individual-details',
  templateUrl: './individual-details.component.html',
  styleUrls: ['./individual-details.component.css']
})
export class IndividualDetailsComponent implements OnInit {

  @Input() emotionClass:Emotion;
  public speechID:string;
  public speechDetails:string;
  public dateTime:string;
  public biasEmotion:string = "None";
  public neutralEmotion:string = "None";
  constructor() { }

  ngOnInit() {
    this.speechID = this.emotionClass.$dataSet.$speechId;
    this.speechDetails = this.emotionClass.$dataSet.$speechDetails;
    this.dateTime = this.emotionClass.$dataSet.$dateTime;
    this.biasEmotion = this.sortBiasEmotion(this.emotionClass.$biasEmotion);
    this.neutralEmotion = this.sortBiasEmotion(this.emotionClass.$neutralEmotion);
    console.log(this.emotionClass);
  }

  sortNeutralEmotion(data)
  {
    console.log(data);
    return "None";
  }

  sortBiasEmotion(biasEmotion:Array<Map<string,string>>)
  {
    var finalString = "";
    if(biasEmotion.length != 0)
    {
      biasEmotion.forEach(e => {
        var integer = 0; 
        e.forEach((key:string, value:string) => {
          if(integer < e.size-1)
          {
            console.log(key);
            finalString = " " + value + ":" + key + " , " + finalString;
          }
          else {
            finalString =  finalString + " " + value + ":" + key;
          }
          
        })

    })
    return finalString; 

    }
    else {
      return "None :(";
    }  
    
  }
  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
