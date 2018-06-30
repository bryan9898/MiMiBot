import { Component, OnInit , Input , OnChanges} from '@angular/core';
import { Emotion } from 'src/app/class/emotion';
import 'chart.piecelabel.js';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';

@Component({
  selector: 'app-individual-details',
  templateUrl: './individual-details.component.html',
  styleUrls: ['./individual-details.component.css']
})
export class IndividualDetailsComponent implements OnInit,OnChanges {

  @Input() emotionClass:Emotion;
  public speechID:string;
  public username:string;
  public speechDetails:string;
  public dateTime:string;
  public biasEmotion:string = "none";
  public analyticsService:AnalyticsService;
  public allEmotionDataSet:Array<Emotion>;
  public keywordSet:Array<Map<string, number>>;
  constructor(as:AnalyticsService) {
    this.analyticsService = as;
   }

  ngOnChanges() {
    this.speechID = this.emotionClass.$dataSet.$speechId;
    this.speechDetails = this.emotionClass.$dataSet.$speechDetails;
    this.username = this.emotionClass.$dataSet.$userId;
    this.dateTime = this.emotionClass.$dataSet.$dateTime;
    var pieChartData = this.sortEmotion(this.emotionClass.$dataSet.$sentiment);
    this.pieChartLabels = pieChartData['label'];
    this.pieChartData = pieChartData['value'];
    this.biasEmotion = this.getBiasEmotion(this.emotionClass.$biasEmotion);
    this.analyticsService.allEmotionSet.subscribe(data => {
      this.allEmotionDataSet = data;
    })
    var keywordMapping = this.getAllKeyword(this.emotionClass.$dataSet.$keywords);
    this.keywordSet = this.sortKeywordMapping(keywordMapping);
  }

  sortKeywordMapping(keywordMapping)
  {
    var newArray:Array<any> = new Array<any>();
    keywordMapping.forEach((value:string, key:number) => {
     
      newArray.push([key, value]);
    });

    return newArray;
  }

  ngOnInit() {
    this.speechID = this.emotionClass.$dataSet.$speechId;
    this.speechDetails = this.emotionClass.$dataSet.$speechDetails;
    this.username = this.emotionClass.$dataSet.$userId;
    this.dateTime = this.emotionClass.$dataSet.$dateTime;
    var pieChartData = this.sortEmotion(this.emotionClass.$dataSet.$sentiment);
    this.pieChartLabels = pieChartData['label'];
    this.pieChartData = pieChartData['value'];
    this.biasEmotion = this.getBiasEmotion(this.emotionClass.$biasEmotion);
    this.analyticsService.allEmotionSet.subscribe(data => {
      this.allEmotionDataSet = data;
    })
    this.getAllKeyword(this.emotionClass.$dataSet.$keywords);

  }

  getAllKeyword(dataset:Map<string, string>)
  {
    var finalArray:Map<string,number> = new Map<string,number>();
    dataset.forEach((key:string , value:string) => {
      finalArray.set(value , 0);
    })


    var allData = this.allEmotionDataSet;
    finalArray.forEach((count, value) => {
      allData.forEach(dataSet => {
        var keywordMap = dataSet.$dataSet.$keywords;
        if(keywordMap.has(value))
        {
          finalArray.set(value , finalArray.get(value)+1);
        }
      })
    })

    return finalArray;
    

  }

  getBiasEmotion(data:Array<Map<string,string>>)
  {
    var feelings:string = "";
    var integer = 0;
    data.forEach(element => {
      element.forEach((value:string , key: string) => {
        if(integer < element.size-1)
        {
      
          feelings = feelings + key + "and";
          integer++; 
        }
        else {
          feelings = feelings + key;
        }
      })
    });
    return feelings;
  }

  sortEmotion(mapping)
  {
    var labelArray:Array<string> = new Array<string>();
    var valuesArray:Array<number> = new Array<number>();
    mapping.forEach((key:string, value:string) => {
         
      labelArray.push(value);
      var numberData = Number.parseFloat(key);
      var roundedOff = numberData.toPrecision(2);
      valuesArray.push(Number(roundedOff));
    
    })
    return{label: labelArray , value:valuesArray};
  }

  
  public pieChartLabels:string[] ;
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'doughnut';
  public colorscheme = ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'];
  public pieChartColours: Array<any> = [
    { // first color
      backgroundColor:this.colorscheme,
      borderColor:this.colorscheme,
      pointBackgroundColor: this.colorscheme,
      pointBorderColor:this.colorscheme,
      pointHoverBackgroundColor: this.colorscheme,
      pointHoverBorderColor: this.colorscheme
    }
   ];
   public pieChartOptions = 
   {
     pieceLabel: {
       render: 'label',
       color: 'black',
       fontWeight: 'bold'
    },
    legend: {
      position: 'left', 
    }

   }
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
