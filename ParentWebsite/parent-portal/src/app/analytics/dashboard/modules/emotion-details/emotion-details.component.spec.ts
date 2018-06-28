import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionDetailsComponent } from './emotion-details.component';

describe('EmotionDetailsComponent', () => {
  let component: EmotionDetailsComponent;
  let fixture: ComponentFixture<EmotionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmotionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmotionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
