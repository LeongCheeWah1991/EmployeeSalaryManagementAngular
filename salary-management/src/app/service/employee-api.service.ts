import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

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

  searchEmployees(minSalary: number, maxSalary: number, offset: number, limit: number, sort: string): Observable<any> {
    let params = {
      minSalary,
      maxSalary,
      offset,
      limit,
      sort
    }

    return this.httpClient.get<Employee[]>(this.employeesUrl, { params: params });
  }

  createEmployee(createEmployee: any) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json');

    let body = JSON.stringify(createEmployee);
    return this.httpClient.post<Employee>(this.employeesUrl, body, { "headers": headers });
  }

  updateEmployee(updatedEmployee: any) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json');

    let body = JSON.stringify(updatedEmployee);
    let id = updatedEmployee.id;
    let urlWithParams = this.employeesUrl + id;
    return this.httpClient.patch<Employee>(urlWithParams, body, { "headers": headers });
  }

  deleteEmployee(selectedEmployeeId: any) {
    let id = selectedEmployeeId;
    let urlWithParams = this.employeesUrl + id;
    return this.httpClient.delete<any>(urlWithParams);
  }

  uploadEmployeeFile(file : File) {

    const headers = new HttpHeaders()

    let formParams = new FormData();
    formParams.append('file', file);
    return this.httpClient.post(this.uploadEmployeesUrl, formParams, { "headers": headers });

  }
}
