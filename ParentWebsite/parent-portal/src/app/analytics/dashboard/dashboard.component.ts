import { Component, OnInit } from '@angular/core';
import { Speeches } from '../../class/speeches';
import { TokenService } from '../../login/token.service';
import { Users } from '../../class/users';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { HttpClient, HttpParams , HttpHeaders  , HttpRequest } from '@angular/common/http';
import {URLSearchParams, QueryEncoder} from '@angular/http';

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

   async ngOnInit() {
    // this.currentUser = this.tks.cu;
    // this.dataSet = this.retrieveFromDatabase(this.currentUser.$Username);
    // this.filteredDataSetLabels = this.filterDataset(this.dataSet , this.currentUser.$Username);

    // this.dataSet = this.retrieveFromDatabase("string");
    // this.filteredDataSetLabels = this.filterDataset(this.dataSet , "string");
    // console.log(this.filteredDataSetLabels[1]);
    // var labelArray = new Array<string>();
    // var dataArray = new Array<number>();
    // this.filteredDataSetLabels[1].forEach(element => {
    //   labelArray.push(element);
    //   dataArray.push(this.filteredDataSetLabels[0][element]);
    // });
  
    // console.log(dataArray);
 
    // this.barChartLabels = labelArray; 
    // this.barChartData =  [
    //   {data: dataArray, label: 'Series A' , backgroundColor: 'rgba(0,0,0,0)'}
    // ];

    var dataList = null;
    dataList = await this.testing();
    var labelArray = new Array<string>();
    var dataArray = new Array<number>();
    if(dataList.length != 0)
    {
      
      console.log(this.filteredDataSetLabels);
      this.showChart = true;
      this.filteredDataSetLabels = this.filterDataset(dataList , "string");
      this.filteredDataSetLabels[1].forEach(element => {
        console.log("Does this happen");
        labelArray.push(element);
        dataArray.push(this.filteredDataSetLabels[0][element]);
      });

      console.log(dataArray);
      this.barChartLabels = labelArray;
      this.barChartData =  [
        {data: dataArray, label: 'Series A'}
      ];
      this.showChart = true;
      // // console.log(labelArray);
      // // console.log(dataArray + "check this");
      // // this.barChartLabels = labelArray;
      // // this.barChartLabels = labelArray; 
      
    }
   
    
    

    // var value = await this.sentimentAnalysis(); 

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
    var class1 = new Speeches(speechId , speechDetails , userId , tagsArray);
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
      backgroundColor: '#82C7A5',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
   ];
 
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
    var speech1 = new Speeches("1", "I want to play, i am bored" , "string" , ["Hunger" , "Toys" , "Games"] );
    var speech2 = new Speeches("2" , "I am hungry" , "string" , ["Hunger" , "Food"] );
    var speech3 = new Speeches("3" , "I miss mummy" , "string1" , ["Love", "Hunger"]);
    var speechArray = new Array<Speeches>();
    speechArray.push(speech1);
    speechArray.push(speech2);
    speechArray.push(speech3);
    return speechArray;
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

  public pieChartLabels:string[] = ['Happy', 'Sad'];
  public pieChartData:number[] = [300, 500];
  public pieChartType:string = 'pie';
 
  // events
  public pieClicked(e:any):void {
    console.log(e);
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
