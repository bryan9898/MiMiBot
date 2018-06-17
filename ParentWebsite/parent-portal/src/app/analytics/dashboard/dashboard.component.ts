import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
            console.log(data);
            console.log(tooltipItem.yLabel);
            console.log(tooltipItem);
            return("There is " + tooltipItem.xLabel + " sentences related to " + tooltipItem.yLabel);
          }
        }
      }
  };
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
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
