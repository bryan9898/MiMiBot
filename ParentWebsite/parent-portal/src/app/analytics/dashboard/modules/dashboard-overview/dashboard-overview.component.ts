import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/service/analytics.service';
import { Emotion } from 'src/app/class/emotion';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit {

  private analyticsService: AnalyticsService;
  private allEmotionalData: Array<Emotion>;
  private emotionValue: string = "testing";
  private emotionName: string = "testing";
  private keywordName: string = "testing";
  private keywordValue: string = "testing";
  private keywordTotal: string = "testing";
  private keywordSetence:string;
  private sentence: string;
  constructor(as: AnalyticsService) {
    this.analyticsService = as;
  }

  ngOnInit() {
    this.analyticsService.allEmotionSet.subscribe(data => {
      this.allEmotionalData = data;
      if (this.allEmotionalData != null) {
        this.filter(this.allEmotionalData);
        var topEmotion = this.calculateTopEmotion(this.allEmotionalData);
        var phrase = "";
        console.log(topEmotion);
        for (var i = 0; i < topEmotion.length; i++) {
          if (i == 0) {
            this.emotionName = topEmotion[i][0];
            var value = Number(topEmotion[i][1]) / this.allEmotionalData.length;
            this.emotionValue = value.toPrecision(2).toString();;
          }
          else if (i < topEmotion.length - 1) {
            var value = Number(topEmotion[i][1]) / this.allEmotionalData.length;
            var valuestr = value.toPrecision(2).toString();
            phrase = phrase + " " + topEmotion[i][0] + " at " + valuestr + "%" + " , ";
          }
          else {
            var value = Number(topEmotion[i][1]) / this.allEmotionalData.length;
            var valuestr = value.toPrecision(2).toString();
            phrase = phrase + " " + topEmotion[i][0] + " at " + valuestr + "%";
          }
        }

        this.sentence = phrase;
        var integer = 0;
        
        this.allEmotionalData.forEach(emotionSet => {
          emotionSet.$dataSet.$keywords.forEach((value, key) => {
            integer++;})
          })

          // this.emotionName = topEmotion[0];
          // var value = Number(topEmotion[1]) / this.allEmotionalData.length;
          // this.emotionValue = value.toPrecision(2).toString();;
          var topKeyword = this.calculateTopKeyword(this.allEmotionalData);
          var topKeywordMapping:Map<string , number> = new Map<string , number>(); 
          topKeyword[1].forEach(data => {
            topKeywordMapping.set(data[0] , data[1]);
          })
          var keywordSentenceBase = "";
          for (var i = 0; i < topKeyword[0].length; i++) {
            if( i == 0)
            {
              this.keywordName = topKeyword[0][i][0];
              this.keywordValue = String(topKeywordMapping.get(topKeyword[0][1][0]));
              this.keywordTotal = String(integer);

            }
            else if( i < topKeyword[0].length -1)
            {
              keywordSentenceBase = keywordSentenceBase + " [" + topKeyword[0][i][0] + ":" + String(topKeywordMapping.get(topKeyword[0][i][0])) +   "/" + integer + "]" + " , ";
            }
            else {
              keywordSentenceBase = keywordSentenceBase + " [" + topKeyword[0][i][0] + ":" + String(topKeywordMapping.get(topKeyword[0][i][0])) + "/" + integer + "]";
              
            }
          }

          this.keywordSetence = keywordSentenceBase;

        }
      })


  }

  calculateTopKeyword(allEmotionalData: Array<Emotion>) {
    var keywordArray: Map<string, number> = new Map<string, number>();
    var keywordValue: Map<string, number> = new Map<string, number>();
    allEmotionalData.forEach(emotionSet => {
      emotionSet.$dataSet.$keywords.forEach((value, key) => {
        if (keywordArray.has(key) == false) {
          keywordArray.set(key, 1);
          keywordValue.set(key, Number(value));
        }
        else {
          keywordArray.set(key, keywordArray.get(key) + 1);
          keywordValue.set(key, keywordValue.get(key) + Number(value));
        }
      })
    })

    var keywordTransform: Array<any> = new Array<any>();
    keywordArray.forEach((v, k) => {
      keywordTransform.push([k, v]);
    });

    console.log(keywordTransform);
    var max = keywordTransform[0][1];
    for (var counter = 1; counter < keywordTransform.length; counter++) {
      if (keywordTransform[counter][1] > max) {
        max = keywordTransform[counter][1];
      }
    }

    var chosenSet: Array<any> = new Array<any>();
    for (var i = 0; i < keywordTransform.length; i++) {
      if (keywordTransform[i][1] == max) {
        chosenSet.push(keywordTransform[i]);
      }
    }


    var finalSet: Array<any> = new Array<any>();
    for (var i = 0; i < chosenSet.length; i++) {
      if (keywordValue.has(chosenSet[i][0])) {
        finalSet.push([chosenSet[i][0], keywordValue.get(chosenSet[i][0])]);
      }
    }



    finalSet.sort((a, b) => {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] < b[1]) ? +1 : 1;
      }
    });

    return [finalSet , chosenSet];



  }

  calculateTopEmotion(data: Array<Emotion>) {
    var arrayOfEmotion: Map<string, number> = new Map<string, number>();
    var arrayOfEmotionValues: Map<string, number> = new Map<string, number>();

    arrayOfEmotion.set("anger", 0);
    arrayOfEmotion.set("fear", 0);
    arrayOfEmotion.set("joy", 0);
    arrayOfEmotion.set("sadness", 0);
    arrayOfEmotion.set("surprise", 0);
    arrayOfEmotion.set("neutral", 0);
    arrayOfEmotionValues.set("anger", 0);
    arrayOfEmotionValues.set("fear", 0);
    arrayOfEmotionValues.set("joy", 0);
    arrayOfEmotionValues.set("sadness", 0);
    arrayOfEmotionValues.set("surprise", 0);
    arrayOfEmotionValues.set("neutral", 0);
    data.forEach(element => {
      element.$biasEmotion.forEach(e => {
        var dataMap: Map<string, string> = e;
        dataMap.forEach((value: string, key: string) => {
          if (arrayOfEmotion.has(key.toLowerCase())) {
            arrayOfEmotionValues.set(key.toLowerCase(), arrayOfEmotionValues.get(key.toLowerCase()) + Number(value));
            arrayOfEmotion.set(key.toLowerCase(), arrayOfEmotion.get(key.toLowerCase()) + 1);
          }
        })
      })
    });

    var array: Array<any> = new Array<any>();
    arrayOfEmotion.forEach((value, key) => {
      array.push([key, value]);
    })

    array.sort((a, b) => {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] < b[1]) ? -1 : 1;
      }
    });

    var max = array[0][1];
    var comparingList: Array<string> = new Array<string>();
    for (var counter = 1; counter < array.length; counter++) {
      if (array[counter][1] > max) {
        max = array[counter][1];
      }
    }


    for (var i = 0; i < array.length; i++) {
      if (array[i][1] == max) {
        comparingList.push(array[i][0]);
      }
    }
    var finalList: Array<any> = new Array<any>();
    for (var i = 0; i < comparingList.length; i++) {
      if (arrayOfEmotionValues.has(comparingList[i])) {
        finalList.push([comparingList[i], arrayOfEmotionValues.get(comparingList[i])]);
      }
    }
    var max = finalList[0][1];
    var secondLoser = 0;
    var index = 0;
    for (var counter = 1; counter < finalList.length; counter++) {
      if (finalList[counter][1] > max) {
        max = finalList[counter][1];
        secondLoser = index;
        index = counter;
      }
    }

    finalList.sort((a, b) => {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] < b[1]) ? +1 : 1;
      }
    });



    return finalList;

  }



  convertToDateName(date) {
    var dateArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return dateArray[date];
  }

  public filter(data) {
    var newEmotionDataset: Array<Emotion> = new Array<Emotion>();
    data.forEach(e => {
      ;
      var date = new Date().getMonth();
      var dateDay = new Date().getDate();
      var dateName = this.convertToDateName(date);
      var dateSet = e.$dataSet.$dateTime.split(",");
      if (dateSet[1].toString().includes(dateName) && dateSet[1].toString().includes(dateDay.toString())) {
        newEmotionDataset.push(e);
      }


    })
    this.allEmotionalData = newEmotionDataset;
    //Show only one date
  }
}

