import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../models/employee';
import { EmployeeApiService } from '../service/employee-api.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import { EmployeeUploadComponent } from '../employee-upload/employee-upload.component';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDashboardComponent implements OnInit {

  displayedColumns = ['id', 'login', 'name', 'salary', 'actions'];

  searchForm: FormGroup = new FormGroup({});

  fullEmployeeList: Employee[] = [];
  employeeList: Employee[] = [];

  dataSource = new MatTableDataSource<Employee>;

  accept = 'csv/*';

  isLoading = false;

  uploadInProgress = false;

  uploadRequest: any;

  totalRecords: number = 0;

  totalRows = 0;

  pageSize = 10;

  currentPage = 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  isSearchActive = false;

  minSalaryCache: any;

  maxSalaryCache: any;

  @ViewChild('empTbSort') empTbSort = new MatSort();

  @ViewChild("paginator")
  paginator!: MatPaginator;

  @ViewChild("fileUpload", { static: false })
  fileUpload!: ElementRef;

  constructor(
    private empApiSvc: EmployeeApiService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.searchEmployees();
    this.refreshGetAllEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.empTbSort;

    // reset the paginator after sorting
    this.empTbSort.sortChange.subscribe(() => { this.paginator.pageIndex = 0; this.currentPage = 0; });

    merge(this.empTbSort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.searchEmployees())
      )
      .subscribe();

  }

  initDatasource() {
    this.dataSource = new MatTableDataSource(this.employeeList);
    this.dataSource.sort = this.empTbSort;
  }

  initSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      minimumSalary: ['', [Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      maximumSalary: ['', [Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
    });
  }

  refreshGetAllEmployees(): any {
    this.empApiSvc.getEmployees().subscribe(data => {
      this.initPaginatorAllRecordsValue(data.length);
    });
  }

  initPaginatorAllRecordsValue(paginatorNumber: number): void {
    this.paginator.length = paginatorNumber;
  }

  searchEmployees(): void {
    this.isLoading = true;

    let minSalary = this.searchForm.controls['minimumSalary'].value;
    let maxSalary = this.searchForm.controls['maximumSalary'].value;

    if (minSalary === undefined || minSalary === '') {
      minSalary = 0;
    }

    if (maxSalary === undefined || maxSalary === '') {
      maxSalary = 0;
    }

    let offset = 0;
    let limit = 10;

    offset = this.pageSize * this.currentPage;
    let sortActive = this.empTbSort.active;
    let sortDirection = this.empTbSort.direction;
    let sortSymbol = '';

    if (sortActive === undefined || sortActive === '') {
      sortActive = 'id';
    }

    if (sortDirection === undefined || sortDirection === '') {
      sortDirection = 'asc';
    }
    if (sortDirection === 'asc') {
      sortSymbol = '+';
    } else {
      sortSymbol = '-';
    }
    let sort = sortSymbol + sortActive;
    this.empApiSvc.searchEmployees(minSalary, maxSalary, offset, limit, sort).subscribe(data => {
      this.employeeList = [];
      this.employeeList = [...data.results];
      this.initDatasource();
      this.isLoading = false;
    });
  }

  searchEmployeesWithinSalaryRange() {
    let minSalary = this.searchForm.controls['minimumSalary'].value;
    let maxSalary = this.searchForm.controls['maximumSalary'].value;

    if(minSalary === this.minSalaryCache && maxSalary === this.maxSalaryCache){
      return;
    }

    if (minSalary === undefined || minSalary === '') {
      minSalary = 0;
    }

    if (maxSalary === undefined || maxSalary === '') {
      maxSalary = 0;
    }

    let searchRecordsLength = 0;
    this.empApiSvc.searchEmployees(minSalary, maxSalary, 0, 2147483647, '+id').subscribe(data => {
      searchRecordsLength = data.results.length;
      this.initPaginatorAllRecordsValue(searchRecordsLength);
    });

    this.minSalaryCache = minSalary;
    this.maxSalaryCache = maxSalary;
  }

  openForm(type: String, selectedRecord: any) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        type,
        selectedRecord
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (result) {
        if (type === 'create') {
          this.showSuccessNotification('Employee created successfully.');
        } else if (type === 'update') {
          this.showSuccessNotification('Employee updated successfully.');
        }
        this.searchEmployees();
        this.refreshGetAllEmployees();

      }
    });
  }

  deleteEmployee(selectedRecord: any) {

    const dialogData = {
      "type": "prompt",
      "title": "Confirm",
      "message": "Confirm delete selected employee?",
      "confirmButtonText": "Delete",
      "cancelButtonText": "Cancel"
    }
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;

      if (result) {
        this.empApiSvc.deleteEmployee(selectedRecord.id).subscribe({

          next: (v) => {
            this.showSuccessNotification('Employee deleted successfully.');
            this.searchEmployees();
            this.refreshGetAllEmployees();
          },
          error: (e) => {
            console.error(e)
            this.showErrorDialog("Error occurred while deleting selected employee.");

          }
        });
      }
    });
  }

  uploadEmployees(event: any) {

    const file = event.target.files[0];

    if (file) {
      this.uploadInProgress = true;
      this.showUploadDialog();
      this.uploadRequest = this.empApiSvc.uploadEmployeeFile(file).subscribe({
        next: (v) => {
          this.uploadInProgress = false;
          this.searchEmployees();
          this.refreshGetAllEmployees();

          this.closeUploadDialog();
        },
        error: (e) => {
          if (e.error.uploadStatus != undefined) {
            if (!e.error.uploadStatus) {
              this.showErrorDialog("Another upload is in progress, please try again later.");
            }
          } else {
            this.showErrorDialog("Error occurred while uploading employees.");
          }
          console.error(e)
        }
      });
      this.fileUpload.nativeElement.value = '';
    }
  }

  initUploadEmployees(event: any) {
    this.fileUpload.nativeElement.click();
  }

  showUploadDialog() {

    let dialogData = {
      "title": "Upload",
      "message": "Uploading is in progress",
      "uploadStatus": this.uploadInProgress
    }

    const dialogRef = this.dialog.open(EmployeeUploadComponent, {
      disableClose: true,
      maxWidth: "400px",
      data: dialogData,

    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (!result) {
        this.uploadRequest.unsubscribe();
        this.searchEmployees();
      }
    });
  }

  showErrorDialog(errorMsg: string) {
    const dialogData = {
      "type": "error",
      "title": "Error",
      "message": errorMsg,
      "errorButtonText": "Okay"
    }
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;

      if (result) {
        this.closeUploadDialog();
        this.searchEmployees();
      }
    });
  }

  closeUploadDialog() {
    this.dialog.closeAll();
  }

  clearSearch() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.isSearchActive = false;
    this.searchForm.controls['minimumSalary'].setValue('');
    this.searchForm.controls['maximumSalary'].setValue('');
    this.minSalaryCache = '';
    this.maxSalaryCache = '';

    this.searchEmployees();
    this.refreshGetAllEmployees();
  }

  onClickSearchEmployees(): void {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.searchEmployees();

    this.searchEmployeesWithinSalaryRange();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
  }

  showSuccessNotification(message: string) {
    this.openSnackBar(message, '', 'success-snackbar');
  }

  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = 2000
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className]
    });
  }
}
