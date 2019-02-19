import { Component, OnInit , Input} from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';
import { Emotion } from 'src/app/class/emotion';
import { Speeches } from 'src/app/class/speeches';
import { EmotionAnalysisComponent } from 'src/app/analytics/dashboard/modules/emotion-analysis/emotion-analysis.component';
import { CloudData, CloudOptions , ZoomOnHoverOptions } from 'angular-tag-cloud-module';
import * as Chart from 'chart.js';
import 'chart.piecelabel.js';

@Component({
  selector: 'app-topic-analysis',
  templateUrl: './topic-analysis.component.html',
  styleUrls: ['./topic-analysis.component.css']
})
export class TopicAnalysisComponent implements OnInit {
  @Input() dataList:Array<Speeches>;

  private emotionDataset:Array<Emotion>;
  private speechsDataset:Array<Speeches>;
  private analyticsService:AnalyticsService;
  private testing:string;
  private dataSetMapping:Map<string, number>; 
  private dataSetData:Array<any>;
  private activeSpeech:Array<Emotion>;
  showTopicDetails = false;
  showEmotionChart = false;
  private topic:string;
  private emotionChart:any;
  private pieChartDataset; 
  private biasData; 
  private pieChartLabels;
  private pieChartData;
  private  currentTopicSet;
  showIndividualDetails
  topicData: CloudData[];
  constructor(private as:AnalyticsService) { 
    this.analyticsService = as;
  }

  ngOnInit() {
    var eac = new EmotionAnalysisComponent(this.analyticsService);
    this.emotionDataset = eac.processEmotion(this.dataList);
    this.speechsDataset = this.getSpeechFromEmotion(this.emotionDataset);
    this.dataSetMapping = this.processTopics(this.speechsDataset);
    this.dataSetData = this.processDatasetMapping(this.dataSetMapping);
    this.topicData = this.processLabelsandValues(this.dataSetData);
    
    this.analyticsService.currentTopicStatus.subscribe(data => {
      this.showIndividualDetails = data;
    })

    this.analyticsService.currentTopicSet.subscribe(data => {
      this.currentTopicSet = data;
    })
  }

  processLabelsandValues(dataSetData:Array<any>)
  {
    var labels = dataSetData[0];
    var count = dataSetData[1];
    var finalArray:Array<any> = new Array<any>();
    for(var i = 0; i < dataSetData[0].length; i++)
    {
      var data = {text:labels[i] , weight: count[i] , color: "#00A8FF"}
      finalArray.push(data);
    }

    return finalArray;
  }

  processDatasetMapping(dataSetMapping:Map<string, number>)
  {
    var arrayOfLabels:Array<string> = new Array<string>(); 
    var arrayOfCount:Array<number> = new Array<number>();
    dataSetMapping.forEach((value , key) => {
      arrayOfLabels.push(key);
      arrayOfCount.push(value);
    })

    return [arrayOfLabels , arrayOfCount];
  }

  processTopics(speechDataset:Array<Speeches>)
  {
    var dataMap:Map<string, number> = new Map<string ,number>(); 
    speechDataset.forEach(data => 
    {
      var topics = data.$topics;
      topics.forEach(indTopics => {
        if(dataMap.has(indTopics))
        {
          dataMap.set(indTopics , dataMap.get(indTopics)+1);
        }
        else {
          dataMap.set(indTopics , 1);
        }
      })
    })

    return dataMap;
  }

  getSpeechFromEmotion(emotionDataset:Array<Emotion>)
  {
    var speechArray:Array<Speeches> = new Array<Speeches>(); 
    emotionDataset.forEach(eds => {
      speechArray.push(eds.$dataSet);
    });
    
    return speechArray;
  }

 

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
    overflow: false,
    width: 1300 , 
    realignOnResize: true,

  }

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 1.2, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
     // Zoom will take affect after 0.8 seconds
  };

  topicClicked(event) {
    this.analyticsService.setCurrentTopicStatus(false);
    this.analyticsService.setCurrentTopicData(null);
    this.showTopicDetails = false;
    var clickedText = event.text;
    this.topic = clickedText;
    var arrayOfClickedTopics:Array<Emotion> = new Array<Emotion>();
    this.emotionDataset.forEach(data => {
      for(var i = 0; i < data.$dataSet.$topics.length; i++)
      {     
        if(data.$dataSet.$topics[i].toLowerCase() == clickedText.toLowerCase())
        {
          arrayOfClickedTopics.push(data);
        }
      }
    })
    this.activeSpeech = arrayOfClickedTopics;
    this.showEmotionChart = true;
    this.pieChartDataset = this.getPiechartData(arrayOfClickedTopics);
    this.biasData = this.sortBiasData(this.pieChartDataset);
    this.pieChartLabels = this.biasData[0];
    this.pieChartData = this.biasData[1];
    this.updateChart(this.pieChartData , this.pieChartLabels);
    
    
  }

  public colorscheme = ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'];
  public pieChartOptions = 
  {
    pieceLabel: {
      render: 'label',
      color: 'black',
      fontWeight: 'bold'
   },
  }

  updateChart(data ,labels)
  {
    console.log(labels);
    console.log(data);
    if(this.emotionChart != null)
    {
      this.emotionChart.data.labels = labels; 
      this.emotionChart.data.datasets = [
        {
          data, 
          backgroundColor:this.colorscheme,
          borderColor:this.colorscheme,
          pointBackgroundColor: this.colorscheme,
          pointBorderColor:this.colorscheme,
          pointHoverBackgroundColor: this.colorscheme,
          pointHoverBorderColor: this.colorscheme
        }];
      this.emotionChart.update();
    
    }
    else {
      this.emotionChart = new Chart('emotionChart' , 
      {
        type: 'doughnut',
        options: this.pieChartOptions,
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor:this.colorscheme,
              borderColor:this.colorscheme,
              pointBackgroundColor: this.colorscheme,
              pointBorderColor:this.colorscheme,
              pointHoverBackgroundColor: this.colorscheme,
              pointHoverBorderColor: this.colorscheme
            }
          ]
        }
      })
    }
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

  public processEmotion(dataList:Array<Speeches>)
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

  private emotion;
  topicEmotionClicked(event)
  {
    var index = this.emotionChart.getElementAtEvent(event)[0]._index;
    var combinedDataset:Array<any> = this.pieChartDataset[0]; 
    var listOfEmotion:Array<Emotion> = new Array<Emotion>();
    combinedDataset.push(this.pieChartDataset[1][0]);
    
    for(var i = 0; i < combinedDataset.length;i++)
    {
      if(combinedDataset[i][1] != 0)
      {
        listOfEmotion.push(combinedDataset[i]);
      }
    }
    this.analyticsService.setCurrentTopicStatus(false);
    this.analyticsService.setCurrentTopicData(null);
    this.analyticsService.setCurrentColorIndex(index.toString());
    this.emotion = listOfEmotion[index][0];
    this.activeSpeech = listOfEmotion[index][2];
    this.showTopicDetails = true;
    
  }
}
