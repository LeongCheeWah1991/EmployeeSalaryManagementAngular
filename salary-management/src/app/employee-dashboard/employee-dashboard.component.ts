import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeApiService } from '../service/employee-api.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  displayedColumns = ['id', 'login', 'name', 'salary', 'actions'];

  dataSource = new MatTableDataSource<Employee>;

  fullEmployeeList: Employee[] = [];

  employeeList: Employee[] = [];

  isLoading = false;

  constructor(
    private empApiSvc: EmployeeApiService,

  ) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  initDatasource() {
    this.dataSource = new MatTableDataSource(this.employeeList);
  }

  getAllEmployees(): void {
    this.empApiSvc.getEmployees().subscribe(data => {
      this.employeeList = [];
      this.employeeList = [...data];
      this.initDatasource();
      this.isLoading = false;
    });
  }
}
