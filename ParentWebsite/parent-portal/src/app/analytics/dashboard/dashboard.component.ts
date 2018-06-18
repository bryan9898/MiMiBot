import { Component, OnInit } from '@angular/core';
import { Speeches } from '../../class/speeches';
import { TokenService } from '../../login/token.service';
import { Users } from '../../class/users';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private dataSet:Array<Speeches> = new Array<Speeches>(); 
  private filteredDataSetLabels:any;

  
  public currentUser: Users;
  public tks: TokenService;

  ngOnInit() {
    // this.currentUser = this.tks.cu;
    // this.dataSet = this.retrieveFromDatabase(this.currentUser.$Username);
    // this.filteredDataSetLabels = this.filterDataset(this.dataSet , this.currentUser.$Username);
    this.dataSet = this.retrieveFromDatabase("string");
    this.filteredDataSetLabels = this.filterDataset(this.dataSet , "string");
    for(var i = 0; i < this.filteredDataSetLabels.length; i++)
    {
      console.log(this.filteredDataSetLabels[i]);
    }
    
  }
  constructor(tks: TokenService) { 
    this.tks = tks;
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
      }
  };

  

  public showTopicDetails: boolean = false; 
  public barChartLabels:string[] = ['Topic One', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6', 'Topic 7'];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' , backgroundColor: 'rgba(0,0,0,0)'}
  ];

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
 
  // events
  public chartClicked(e:any):void {
    this.showTopicDetails = true;
  }
 
  public chartHovered(e:any):void {
  }

  private retrieveFromDatabase(currentUser)
  {
    console.log(this.currentUser);
    //Fake data first 
    var speech1 = new Speeches("1", "I want to play, i am bored" , "string" , ["Bored" , "Toys" , "Games"] );
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
    var filteredDataset: Array<Speeches> = new Array<Speeches>();
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
        filteredDataset.push(element);
        
      }
    })
    var counts = {};

    for (var i = 0; i < filteredDataset.length; i++) {
      for(var a = 0; a < filteredDataset[i].$topics.length ; a++)
      {
        var num = filteredDataset[i].$topics[a];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
    }
    console.log(counts);
    return counts;


 


  }
}
