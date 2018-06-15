import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatButtonModule, MatProgressBarModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';

import { MatMenuModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MatMenuModule, 
    MatButtonModule, 
    MatTabsModule, 
    BrowserAnimationsModule, 
    MatFormFieldModule, 
    MatProgressBarModule,
    MatRadioModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
