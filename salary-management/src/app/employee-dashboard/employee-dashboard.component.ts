import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeApiService } from '../service/employee-api.service';
import { Employee } from '../models/employee';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeUploadComponent } from '../employee-upload/employee-upload.component';

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

  uploadInProgress = false;

  uploadRequest: any;

  accept = 'csv/*';

  @ViewChild("fileUpload", { static: false })
  fileUpload!: ElementRef;

  constructor(
    private empApiSvc: EmployeeApiService,
    private dialog: MatDialog,
    private readonly snackBar: MatSnackBar,

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

        this.getAllEmployees();
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
            this.getAllEmployees();
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
          this.getAllEmployees();

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
        this.getAllEmployees();
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
        this.getAllEmployees();
      }
    });
  }

  closeUploadDialog() {
    this.dialog.closeAll();
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
