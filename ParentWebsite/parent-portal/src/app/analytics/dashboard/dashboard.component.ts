import { Component, OnInit } from '@angular/core';
import { Speeches } from '../../class/speeches';
import { TokenService } from '../../login/token.service';
import { Users } from '../../class/users';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest } from '@angular/common/http';
import {URLSearchParams, QueryEncoder} from '@angular/http';
import { element } from 'protractor';
import { Emotion } from 'src/app/class/emotion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  private dataSet:Array<Speeches> = new Array<Speeches>(); 
  private filteredDataSetLabels:any;
  public barChartLabels:string[];
  public barChartData;
  public currentUser: Users;
  public tks: TokenService;
  private filteredDataset: Array<Speeches> = new Array<Speeches>();
  private loaded:Boolean = false;
  private showChart = false;
  private emotionDataset:Array<Emotion>;
  public pieChartLabels:string[];
  public pieChartData:number[];
  public pieChartDataset;
  public biasData;
  public pieChartType:string = 'doughnut';
   async ngOnInit() {
  

    var dataList = null;
    dataList = await this.testing();
    var labelArray = new Array<string>();
    var dataArray = new Array<number>();
    this.currentUser = this.tks.cu;
    if(dataList.length != 0)
    {
      
      this.showChart = true;
      this.filteredDataSetLabels = this.filterDataset(dataList , "string");
      this.filteredDataSetLabels[1].forEach(element => {
        console.log("Does this happen");
        labelArray.push(element);
        dataArray.push(this.filteredDataSetLabels[0][element]);
      });

      console.log(dataList);
      this.barChartLabels = labelArray;
      this.barChartData =  [
        {data: dataArray, label: 'Series A'}
      ];


      //Set up sentiment analysis
      this.emotionDataset = this.processEmotion(dataList);
      this.pieChartDataset = this.getPiechartData(this.emotionDataset);
      this.biasData = this.sortBiasData(this.pieChartDataset);
      console.log(this.pieChartDataset);
      this.pieChartLabels = this.biasData[0];
      this.pieChartData = this.biasData[1];
      this.showChart = true;
      


      // // console.log(labelArray);
      // // console.log(dataArray + "check this");
      // // this.barChartLabels = labelArray;
      // // this.barChartLabels = labelArray; 
      
    }
   
    
    

    // var value = await this.sentimentAnalysis(); 

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

    labels.push(dataSet[1][0][0]);
    var test = dataSet[1][0][1];
    value.push(test);
    return ([labels, value]);
  }

  getPiechartData(dataSet:Array<Emotion>)
  {
    var biasSet:Array<Array<any>> = new Array<Array<any>>();
    biasSet.push(["anger" , 0], ["fear" , 0] , ["joy" , 0] , ["sadness" , 0] , ["surprise" , 0]);
    var neutralSet:Array<any> = new Array<any>();
    neutralSet.push(["neutral" , 0]);
    dataSet.forEach(ds => {
      if(ds.$status == "bias")
      {
         ds.$biasEmotion.forEach(es => {
           es.forEach((key:string, value:string) => {
              for(var i =0; i < biasSet.length; i++)
              {
                console.log(biasSet[i][0] + "|" + value);
                if(biasSet[i][0].toLowerCase() == value.toLowerCase())
                {
                  biasSet[i][1] = biasSet[i][1] + 1; 
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

  async testing() {
    var bearer = {
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }
  
    var results = await this.http.get("https://mimiwebserver.azurewebsites.net/api/Speeches" , {bearer}).toPromise();
    var dataList:Array<Speeches> = new Array<Speeches>();
    results.forEach(e => {
      var data = this.convertToSpeeches(e);
      dataList.push(data);
    })

    return dataList;
  }

  convertToSpeeches(data)
  {
    console.log(data);
    var speechId = data['speechId']; 
    var speechDetails = data['speechDetails'];
    var userId = data['userId'];
    var tags = data['tags'];
    var tagsArray = tags.split(",");
    var sentiment = data['sentiment'];
    var sentimentArray = sentiment.split(",");
    var map:Map<string, string> = new Map<string,string>();
    var sentimentType:Array<string> = new Array<string>("Anger", "Fear", "Joy", "Sadness" , "Surprise"); 
    for(var i = 0; i < sentimentType.length; i++)
    {
      map.set(sentimentType[i] , sentimentArray[i]);
    }
    var class1 = new Speeches(speechId , speechDetails , userId , tagsArray, map);
    return class1;
  }
  async sentimentAnalysis() {
    // var url = "http://text-processing.com/api/sentiment/";
    // var headerss = new HttpHeaders({
    //   'Content-Type' : 'application/X-www-form-urlencoded',

    // });
    // let body = new URLSearchParams();
    // body.set('text', "I am very happy");
    // var result =  await this.http.post(url , body ).toPromise();

    throw new Error("Method not implemented.");
  }

  private http;
  constructor(tks: TokenService , http: HttpClient) { 
    this.tks = tks;
    this.http = http;
  }



  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true, 
    legends: [{
        labels: {
          defaultFontSize: 30,
        }
    }],
    tooltips: {
      callbacks: {
          label: function(tooltipItem, data) {
            return("There is " + tooltipItem.xLabel + " sentences related to " + tooltipItem.yLabel);
          }
        }
      },
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
            stepSize: 1,
            autoSkip: false, 
            fontColor: "Black",
            fontWeight: "Bold",
            fontSize: 14
            
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: "Black",
            fontWeight: "Bold",
            fontSize: 14
          }
        }
      ]
    }
  };

  

  public showTopicDetails: boolean = false; 
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;
 

  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#00A8FF',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
   ];

   public pieChartColor: Array<any> = [
    { // first color
      backgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
      borderColor:['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
      pointBackgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9' , '#AC92EC'],
      pointBorderColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
      pointHoverBackgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9' , '#AC92EC'],
      pointHoverBorderColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC']
    }
   ];

   
  //#FC6E51
  //#FFCE54
  //#48CFAD
  //#4FC1E9
  //#5D9CEC
  //#AC92EC
 
  public activeSpeech:Array<Speeches> = new Array<Speeches>();
  // events
  public chartClicked(e:any):void {
    this.activeSpeech = new Array<Speeches>();
    this.showTopicDetails = true;
    var topic = e['active']['0']._model['label'];
   
    console.log(this.filteredDataset);
    this.filteredDataset.forEach(e => {
      for(var i = 0; i < e.$topics.length; i++)
      {
        if(topic == e.$topics[i])
        {
          this.activeSpeech.push(e);
        }
      }
    });


  }
 
  public chartHovered(e:any):void {
  }

  private retrieveFromDatabase(currentUser)
  {
    console.log(this.currentUser);
    //Fake data first 
    // var speech1 = new Speeches("1", "I want to play, i am bored" , "string" , ["Hunger" , "Toys" , "Games"] );
    // var speech2 = new Speeches("2" , "I am hungry" , "string" , ["Hunger" , "Food"] );
    // var speech3 = new Speeches("3" , "I miss mummy" , "string1" , ["Love", "Hunger"]);
    // var speechArray = new Array<Speeches>();
    // speechArray.push(speech1);
    // speechArray.push(speech2);
    // speechArray.push(speech3);
    // return speechArray;
  }

 

  private filterDataset(dataset,  userName)
  {
    var filteredLabels: string [][] = new Array<Array<string>>() ;
    var start = true;
    var a = 0; 
    var mySet: Set<string> = new Set<string>();
    dataset.forEach(element => {
      var current:Speeches = element;
      if(current.$userId == userName)
      {
        var currentTopics = current.$topics;
        for(var i = 0; i < currentTopics.length; i++)
        {
          mySet.add(currentTopics[i]);
        }
        this.filteredDataset.push(element);
        
      }
    })
    var counts = [];
    var array1:Array<Array<string>>;
    array1 = new Array<Array<string>>();
    for (var i = 0; i < this.filteredDataset.length; i++) {
      for(var a = 0; a < this.filteredDataset[i].$topics.length ; a++)
      {
        var num = this.filteredDataset[i].$topics[a];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
    }
    
    return [counts, mySet];
  }

 
 
  // events
  public pieClicked(e:any):void {
    var integer =0;
    //do soime functionm 
  }
 
  public pieHovered(e:any):void {
    console.log(e);
  }




  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
    width : 1000,
    height : 400,
    overflow: false,
  }
 
  data: CloudData[] = [
    {text: 'Happy', weight: 60, link: 'https://google.com', color: '#ffaaee'},
    {text: 'Testing', weight: 50, link: 'https://google.com'},
    // ...
  ]
}
