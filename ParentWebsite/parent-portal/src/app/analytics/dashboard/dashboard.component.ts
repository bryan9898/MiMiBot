import { Component, OnInit } from '@angular/core';
import { Speeches } from '../../class/speeches';
import { TokenService } from '../../login/token.service';
import { Users } from '../../class/users';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest } from '@angular/common/http';
import {URLSearchParams, QueryEncoder} from '@angular/http';
import { element } from 'protractor';
import { Emotion } from 'src/app/class/emotion';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';

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
  showChart = false;
  private showChart2 = false;
  showGameChart = false;
  chartClicked1 = false;
  private emotionDataset:Array<Emotion>;
  public pieChartLabels:string[];
  public pieChartData:number[];
  public pieChartDataset;
  public biasData;
  public pieChartType:string = 'doughnut';
  public dataList:Array<Speeches> = [];
  private analyticsService:AnalyticsService;
  private http;
  constructor(tks: TokenService , http: HttpClient , as:AnalyticsService) { 
    this.tks = tks;
    this.http = http;
    this.analyticsService = as;
  }

   async ngOnInit() {
  
    try{
      this.dataList = await this.testing();
      await this.getGameMarks();
      for(var i = 0; i < this.dataList.length; i++)
      {
        if(this.dataList[i].$speechDetails.includes("game time"))
        {
          this.dataList.splice(i, 1);
        }
      }
       // change this user 
       this.dataList = this.filterDataSetActual(this.dataList , "string");
     
    }
    catch(error)
    {
      console.log("error");
    }
    var labelArray = new Array<string>();
    var dataArray = new Array<number>();
    this.currentUser = this.tks.cu;
    if(this.dataList.length != 0)
    {
      
      this.showChart = true;
      this.filteredDataSetLabels = this.filterDataset(this.dataList , "string");
      this.filteredDataSetLabels[1].forEach(element => {
        labelArray.push(element);
        dataArray.push(this.filteredDataSetLabels[0][element]);
      });
      this.barChartLabels = labelArray;
      this.barChartData =  [
        {data: dataArray, label: 'Series A'}
      ];
    }
   
  }

//bryan's data

  private GameData : game[] = [];
    private monCounter = 0;
    private tuesCounter = 0;
    private wedCounter = 0;
    private thursCounter = 0;
    private friCounter = 0;
    private satCounter = 0;
    private sunCounter = 0;
    private counterPage : game[] = [] ;
    private totalMarks = 0;
    private overallMarks = 0;
     private z = 0;
     //private GameSets :any;
    
    async getGameMarks() {
      var bearer = {
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    
       var GameSets = await this.http.get("https://mimiwebserver.azurewebsites.net/api/Marks" , {headers: bearer}).toPromise();
       if(GameSets != null){
        this.showGameChart = true;
       }
     // var dataList:Array<Speeches> = new Array<Speeches>();
     for (this.z; this.z < GameSets.length; this.z++){
        this.GameData.push({markId:GameSets[this.z].markId ,userId:GameSets[this.z].userId,question:GameSets[this.z].question ,markValue:GameSets[this.z].markValue,date:GameSets[this.z].date})
        
       //console.log(this.GameData[this.z].date);
     }

     for(var i = 0 ; i < this.GameData.length;i++){
        if(this.GameData[i].date == this.barChartGameLabels[0]){
          this.monCounter =  this.monCounter + 1;
        } else if(this.GameData[i].date == this.barChartGameLabels[1]){
          this.tuesCounter =  this.tuesCounter + 1;
        }else if(this.GameData[i].date == this.barChartGameLabels[2]){
          this.wedCounter =  this.wedCounter + 1;
        }else if(this.GameData[i].date == this.barChartGameLabels[3]){
          this.thursCounter =  this.thursCounter + 1;
        }else if(this.GameData[i].date == this.barChartGameLabels[4]){
          this.friCounter =  this.friCounter + 1;
        }else if(this.GameData[i].date == this.barChartGameLabels[5]){
          this.satCounter =  this.satCounter + 1;
        }else if(this.GameData[i].date == this.barChartGameLabels[6]){
          this.sunCounter = this.sunCounter + 1;
        }
     }
     
      this.barChartGameData = [
        {data : [this.monCounter,this.tuesCounter , this.wedCounter ,  this.thursCounter ,  this.friCounter ,  this.satCounter , this.sunCounter] , label : 'Number of quizes on that day'}
      
      ];
      //return dataList;
    }


//Bryan's bar chart

  public barChartGameOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartGameLabels:string[] = ["Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday" , "Sunday"];
  public barChartGameType:string = 'bar';
  public barChartGameLegend:boolean = true;

  public barChartGameData:any[] = [
    {data: [0, 0, 0, 0, 0, 0, 0]}
  
  ];

  public chartGameClicked(e:any):void {
    console.log(e);
    var day = e['active']['0']._model['label'];
    var totalsize = this.counterPage.length;
    this.totalMarks = 0;
    this.overallMarks = 0;
    for(var x = 0 ; x < totalsize ; x++){
      
      this.counterPage.pop();
   
    }
    for(var i = 0 ; i < this.GameData.length;i++){
      if(this.GameData[i].date == day){
       
        this.counterPage.push({markId:this.GameData[i].markId ,userId:this.GameData[i].userId,question:this.GameData[i].question ,markValue:this.GameData[i].markValue,date:this.GameData[i].date})
        this.chartClicked1 = true;
        
        if(this.GameData[i].markValue == "1"){
          this.totalMarks = this.totalMarks+1;
        } else if(this.GameData[i].markValue == "0"){
          this.totalMarks = this.totalMarks+0;
        }
       
      }
    }

    this.overallMarks = this.counterPage.length;
  }
 
  public chartGameHovered(e:any):void {
    console.log(e);
  }
 
  

  //ends here

  filterDataSetActual(dataset: any, userName: any): any {
    var filteredLabels: string [][] = new Array<Array<string>>() ;
    var start = true;
    var a = 0; 
    var mySet: Set<string> = new Set<string>();
    var filterDataset:Array<Speeches> = new Array<Speeches>();
    dataset.forEach(element => {
      var current:Speeches = element;
      if(current.$userId == userName)
      {
        var currentTopics = current.$topics;
        for(var i = 0; i < currentTopics.length; i++)
        {
          mySet.add(currentTopics[i]);
        }
        filterDataset.push(element);
        
      }
    })
    return filterDataset;
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

  // processEmotion(dataList:Array<Speeches>)
  // {
  //   var setOfUnfilteredEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
  //   dataList.forEach(element => {
  //     console.log("testing");
  //     setOfUnfilteredEmotion.push(element.$sentiment)
  //   });

  //   var integer = 0; 
  //   var emotionFilteredList:Array<any> = new Array<any>();
  //   setOfUnfilteredEmotion.forEach(emotion => {
  //     var biasEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
  //     var neturalEmotion:Array<Map<string,string>> = new Array<Map<string,string>>();
  //     emotion.forEach((value: string, key: string) => {
  //       var valid = false;
  //       valid = this.checkIfSentimentIsAbove20(value);
  //       if(valid == true)
  //       {
  //         var newMap = new Map();
  //         newMap.set(key, value);
  //         biasEmotion.push(newMap);
          
  //       }
  //       else {
  //         var newMap = new Map();
  //         newMap.set(key, value);
  //         neturalEmotion.push(newMap);
  //       }
  //     })

  //     var newEmotionClass = new Emotion(biasEmotion , neturalEmotion , dataList[integer]);
  //     emotionFilteredList.push(newEmotionClass);
  //     integer++;

  //   })




  //   return emotionFilteredList; 
    
  // }

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

    var keyword = data['keyword'];
    var keywordData = keyword.split(",");
    var keywordMap:Map<string ,string> = new Map <string, string>(); 
    var integer = 0; 
    keywordData.forEach(element => {
      if(integer < keywordData.length -1)
      {
        var valuePair = element.split(":");
        keywordMap.set(valuePair[0], valuePair[1]);
      }
      
      integer++; 
    });
    var dateTime = data['dateTime'];
    
    var class1 = new Speeches(speechId , speechDetails , userId , tagsArray, map , keywordMap , dateTime);
    return class1;
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

 
  public activeSpeech:Array<Speeches> = new Array<Speeches>();
  // events
  public chartClicked(e:any):void {
    this.activeSpeech = new Array<Speeches>();
    this.showTopicDetails = true;
    var topic = e['active']['0']._model['label'];
   
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

 

  public filterDataset(dataset,  userName)
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

 
  // public pieChartColor: Array<any> = [
  //   { // first color
  //     backgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
  //     borderColor:['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
  //     pointBackgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9' , '#AC92EC'],
  //     pointBorderColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC'],
  //     pointHoverBackgroundColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9' , '#AC92EC'],
  //     pointHoverBorderColor: ['#ED5565','#FC6E51','#FFCE54', '#48CFAD' , '#4FC1E9'  , '#AC92EC']
  //   }
  //  ];

  // // events
  // public pieClicked(e:any):void {
  //   var integer =0;
  //   var mainArray:Array<Array<Emotion>> = new Array<Array<Emotion>>();
  //   var tempArray = new Array();
  //   this.pieChartDataset.forEach(element => {
  //     element.forEach(data => {
  //       tempArray.push(data);
  //     });
  //   });

  //  tempArray.forEach(data => {
  //    if(data[2] != 0)
  //    {
  //      mainArray.push(data);
  //    }
  //  })
  //  try{
  //   var currentIndex = e['active'][0]._index;
  //   var currentDataset = mainArray[currentIndex];
  //   console.log(currentDataset);
  //  }
  //  catch{
  //    console.log("error");
  //  }
 

  // }
 
  // public pieHovered(e:any):void {
  //   console.log(e);
  // }




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

export interface gameScore {
  markId:any;
  userId:any;
  question:any;
  markValue:any;
  date:any;
 }

 export interface game {
  markId:any;
  userId:any;
  question:any;
  markValue:any;
  date:any;
 
 }