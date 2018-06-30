import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { Emotion } from 'src/app/class/emotion';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private emotionStatus = new BehaviorSubject<Boolean>(false);
  public currentEmotionInd = this.emotionStatus.asObservable();

  private emotionSet = new BehaviorSubject<Emotion>(null);
  public currentEmotionSet = this.emotionSet.asObservable();

  private emotionDataset = new BehaviorSubject<Array<Emotion>>(null);
  public allEmotionSet = this.emotionDataset.asObservable();
  constructor() { }

  setCurrentEmotionIndStatus(value:boolean)
  {
    this.emotionStatus.next(value);
  }

  setCurrentEmotionIndDataset(currentEmotion:Emotion)
  {
    this.emotionSet.next(currentEmotion);
  }

  setAllEmotionDataset(emotionDataset:Array<Emotion>)
  {
    this.emotionDataset.next(emotionDataset);
  }
}
