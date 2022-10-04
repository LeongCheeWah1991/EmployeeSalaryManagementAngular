import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMaterialModule } from './ng-material/ng-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeFunctionOneComponent } from './employee-function-one/employee-function-one.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeDashboardComponent,
    EmployeeFunctionOneComponent,
  ],
  imports: [
    BrowserModule,
    NgMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
