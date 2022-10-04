import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMaterialModule } from './ng-material/ng-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeFunctionOneComponent } from './employee-function-one/employee-function-one.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { EmployeeUploadComponent } from './employee-upload/employee-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeDashboardComponent,
    EmployeeFunctionOneComponent,
    EmployeeFormComponent,
    PromptDialogComponent,
    EmployeeUploadComponent,
  ],
  imports: [
    BrowserModule,
    NgMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
