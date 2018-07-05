import { Component, OnInit , Input} from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';
import { Emotion } from 'src/app/class/emotion';
import { Speeches } from 'src/app/class/speeches';
import { EmotionAnalysisComponent } from 'src/app/analytics/dashboard/modules/emotion-analysis/emotion-analysis.component';
import { CloudData, CloudOptions , ZoomOnHoverOptions } from 'angular-tag-cloud-module';

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

    console.log(finalArray);
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

}
