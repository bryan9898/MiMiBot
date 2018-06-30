import { Component, OnInit , Input} from '@angular/core';
import { Emotion } from 'src/app/class/emotion';
import { Speeches } from 'src/app/class/speeches';
import { CloudOptions, CloudData, ZoomOnHoverOptions } from 'angular-tag-cloud-module/src/app/tag-cloud-module/tag-cloud.interfaces';
import { KeyedWrite } from '@angular/compiler';
import 'chart.piecelabel.js';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';

@Component({
  selector: 'app-emotion-analysis',
  templateUrl: './emotion-analysis.component.html',
  styleUrls: ['./emotion-analysis.component.css']
})
export class EmotionAnalysisComponent implements OnInit {

  private emotionDataset:Array<Emotion>;
  public pieChartLabels:string[];
  public pieChartData:number[];
  public pieChartDataset;
  public biasData;
  public pieChartType:string = 'doughnut';
  public chartDetails:Boolean = false;
  public wordCloudDataMap:Map<string,number>;
  public currentTopic
  public currentDataset;
  public keyword;
  public currentColor;
  private analyticsService:AnalyticsService;
  public emotionIndividual:Boolean = false;
  public currentEmotionSet:Emotion;
  
  constructor(as:AnalyticsService) { 
    this.analyticsService = as;
  }

  @Input() dataList:Array<Speeches>;

  ngOnInit() {

     //Set up sentiment analysis
     this.emotionDataset = this.processEmotion(this.dataList);
     this.analyticsService.setAllEmotionDataset(this.emotionDataset);
     this.pieChartDataset = this.getPiechartData(this.emotionDataset);
     this.biasData = this.sortBiasData(this.pieChartDataset);
     this.pieChartLabels = this.biasData[0];
     this.pieChartData = this.biasData[1];
     this.analyticsService.currentEmotionInd.subscribe(data => {
      this.emotionIndividual = data;
    })

    this.analyticsService.currentEmotionSet.subscribe(data => {
      this.currentEmotionSet = null;
      this.currentEmotionSet = data;
      if(this.currentEmotionSet != null)
      {
        var individualData = document.getElementById("emotionIndividual");
        
        if(individualData != null)
        {
          
          individualData.scrollIntoView({behavior:"smooth"});
          
        }
      }
    })
    //  this.showChart = true;
     

  }

  sortBiasData(dataSet):any
  {
    var labels:Array<string> = new Array<string>();
    var value:Array<number> = new Array<number>();
    
    dataSet[0].forEach(element => {
      if(element[1] != 0 )
      {
        labels.push(element[0]);
        value.push(Number.parseFloat(element[1]));
      }
      });
    
    if(dataSet[1][0][1] != 0)
    {
      labels.push(dataSet[1][0][0]);
      var test = dataSet[1][0][1];
      value.push(test);
    }
    return ([labels, value]);
  }

  getPiechartData(dataSet:Array<Emotion>)
  {
    var biasSet:Array<Array<any>> = new Array<Array<any>>();
    biasSet.push(["anger" , 0 , new Array<Emotion>()], ["fear" , 0 , new Array<Emotion>()] , ["joy" , 0 , new Array<Emotion>()] , ["sadness" , 0 , new Array<Emotion>()] , ["surprise" , 0 , new Array<Emotion>()]);
    var neutralSet:Array<any> = new Array<any>();
    neutralSet.push(["neutral" , 0 , new Array<Emotion>()]);
    dataSet.forEach(ds => {
      if(ds.$status == "bias")
      {
         ds.$biasEmotion.forEach(es => {
           es.forEach((key:string, value:string) => {
              for(var i =0; i < biasSet.length; i++)
              {
                if(biasSet[i][0].toLowerCase() == value.toLowerCase())
                {
                  biasSet[i][1] = biasSet[i][1] + 1; 
                  biasSet[i][2].push(ds);
                }
              }
           })
         })
      }
      else
      {
        for(var i = 0; i < neutralSet.length; i++)
        {
          neutralSet[i][1] = neutralSet[i][1]+ 1;
          neutralSet[i][2].push(ds);
        }
      }
    })
    return ([biasSet , neutralSet]);
  }

  processEmotion(dataList:Array<Speeches>)
  {
    var setOfUnfilteredEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
    dataList.forEach(element => {
      setOfUnfilteredEmotion.push(element.$sentiment)
    });

    var integer = 0; 
    var emotionFilteredList:Array<any> = new Array<any>();
    setOfUnfilteredEmotion.forEach(emotion => {
      var biasEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
      var neturalEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
      emotion.forEach((value: string, key: string) => {
        var valid = false;
        valid = this.checkIfSentimentIsAbove20(value);
        if(valid == true)
        {
          var newMap = new Map();
          newMap.set(key, value);
          biasEmotion.push(newMap);
          
        }
        else {
          var newMap = new Map();
          newMap.set(key, value);
          neturalEmotion.push(newMap);
        }
      })

      var newEmotionClass = new Emotion(biasEmotion , neturalEmotion , dataList[integer]);
      emotionFilteredList.push(newEmotionClass);
      integer++;

    })




    return emotionFilteredList; 
    
  }

  checkIfSentimentIsAbove20(data)
  {
    var floatData = Number.parseFloat(data);
    if(floatData > 0.25)
    {
      return true; 
    }
    else {
      return false;
    }

  }

  public colorscheme = ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'];
  public pieChartColor: Array<any> = [
    { // first color
      backgroundColor:this.colorscheme,
      borderColor:this.colorscheme,
      pointBackgroundColor: this.colorscheme,
      pointBorderColor:this.colorscheme,
      pointHoverBackgroundColor: this.colorscheme,
      pointHoverBorderColor: this.colorscheme
    }
   ];

  // events
  public pieClicked(e:any):void {
    this.cloudDetails = false;
    this.chartDetails = false;
    this.emotionIndividual = false;
    var integer =0;
    var mainArray:Array<Array<Emotion>> = new Array<Array<Emotion>>();
    var tempArray = new Array();
    this.pieChartDataset.forEach(element => {
      element.forEach(data => {
        tempArray.push(data);
      });
    });

   tempArray.forEach(data => {
     if(data[2] != 0)
     {
       mainArray.push(data);
     }
   })
   try{
    var currentIndex = e['active'][0]._index;
    this.currentColor = this.colorscheme[currentIndex];
    this.currentDataset = mainArray[currentIndex];
    this.currentTopic = this.currentDataset[0];
    this.chartDetails = true;
    this.wordCloudDataMap = this.createWordCloudData(this.currentDataset);
    var wordCloudArray = new Array();
    this.wordCloudDataMap.forEach((counts, topic) => {
      var newFormat = {text:topic , weight:counts , color: this.currentColor , fontWeight: "bold"};
      wordCloudArray.push(newFormat);
    })
    this.CloudData = wordCloudArray;
    var chartElement = document.getElementById("chartDetailsID")
    if(chartElement != null)
    {
      chartElement.scrollIntoView({behavior:"smooth"});
    }
    
   }
   catch{
     console.log("error");
     this.chartDetails = false;
   }

   

  }

  
 
  public pieHovered(e:any):void {
    console.log(e);
  }

  public pieChartOptions = 
    {
      pieceLabel: {
        render: 'label',
        color: 'black',
        fontWeight: 'bold'
     },
    }
  

  createWordCloudData(currentDataset)
  {
    
    var allMapping:Array<any> = new Array<any>();
    var wordCloud:Map<string, number> = new Map<string, number>();

    var list:Map<string , number> = new Map<string, number>();
    currentDataset[2].forEach(element => {
      var data:Speeches = element.dataSet;
      var keyWords:Map<string , string> = data.$keywords;
      allMapping.push(keyWords);
    });

    var integer = 0; 
    allMapping.forEach(map => {
      map.forEach((value: string, key: string) => 
      {
        if(integer == 0)
        {
          var newMap = new Map();
          newMap.set(key, 1);
          wordCloud = newMap;
          integer++;
        }
        else {
         if(wordCloud.has(key))
         {
            var currentCount = wordCloud.get(key);
            wordCloud.set(key , currentCount + 1 );
         }
         else {
          wordCloud.set(key, 1);
         }
          
        }
      })
    })
    return wordCloud;
  }

  
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
    overflow: false,
    realignOnResize: true,
    
  }

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 1.2, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
     // Zoom will take affect after 0.8 seconds
  };
 
  CloudData: CloudData[];

  public allEmotions:Array<Array<any>>  = new Array<Array<any>>();; 
  public cloudDetails = false;

  cloudClicked(event:CloudData)
  {
    this.emotionIndividual = false;
    this.allEmotions = new Array<Array<any>>();
    var keyword = event.text;
    this.keyword = event.text;
    this.currentDataset[2].forEach(element => {
      var dataSet:Speeches = element.dataSet;
     if(dataSet.$keywords.has(this.keyword))
      {
        this.allEmotions.push([element,this.currentColor]);
      }
     
      // allSpeeches.push(speechesCurrent);s
    });

    this.cloudDetails = true;
    var cloudDetailsID = document.getElementById("test");
    if(cloudDetailsID != null)
    {
      cloudDetailsID.scrollIntoView({behavior:"smooth"});
    }
  }


}
