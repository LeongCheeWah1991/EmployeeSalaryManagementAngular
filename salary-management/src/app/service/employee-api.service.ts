import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  employeesUrl = "/users/"
  getAllEmployeesUrl = '/users/getall'
  uploadEmployeesUrl = "/users/upload"

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEmployees(): Observable<any> {
    return this.httpClient.get<any>(this.getAllEmployeesUrl);
  }

}
