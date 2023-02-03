import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../models/employee';
import { EmployeeApiService } from '../service/employee-api.service';
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  employeeForm: FormGroup = new FormGroup({});

  formType: String = '';

  errorMsg: any;

  maxLength: number = 100;

  nameMaxLength: number = 255;

  @ViewChild('employeeIdInput')
  employeeIdInput!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    private formBuilder: FormBuilder,
    private empApiSvc: EmployeeApiService,
  ) { }

  ngOnInit(): void {
    this.formType = this.data.type;
    this.initEmployeeForm();
  }

  ngAfterViewInit(): void {
    if (this.formType === 'update') {
      this.employeeIdInput.nativeElement.disabled = true;
    }
  }

  initEmployeeForm(): void {
    if (this.formType === 'create') {
      this.employeeForm = this.formBuilder.group({
        id: [null, [Validators.required, Validators.maxLength(this.maxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        login: [null, [Validators.required, Validators.maxLength(this.maxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        name: [null, [Validators.required, Validators.maxLength(this.nameMaxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        salary: [null, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
      });
    } else if (this.formType === 'update') {
      this.employeeForm = this.formBuilder.group({
        id: [this.data.selectedRecord.id, [Validators.required, Validators.maxLength(this.maxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        login: [this.data.selectedRecord.login, [Validators.required, Validators.maxLength(this.maxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        name: [this.data.selectedRecord.name, [Validators.required, Validators.maxLength(this.nameMaxLength), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        salary: [this.data.selectedRecord.salary, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
      });
    }
  }

  onConfirm(type: String): void {
    // Close the dialog, return true
    let id = this.employeeForm.controls['id'].value;
    let login = this.employeeForm.controls['login'].value;
    let name = this.employeeForm.controls['name'].value;
    let salary = this.employeeForm.controls['salary'].value;

    if (this.formType === 'create') {
      let createEmployee = new Employee(id, login, name, salary);
      this.empApiSvc.createEmployee(createEmployee).subscribe({

        next: (v) => {
          console.log(v),
            this.dialogRef.close(true);
        },
        error: (e) => {
          console.log(e);
          if (e.error.errorMsg) {
            console.log('here 1');
            this.errorMsg = e.error.errorMsg;
          } else if (e.error.messages) {
            console.log('here 2');

            this.errorMsg = e.error.messages;
          }
          console.log(this.errorMsg)

        }
      });
    } else if (this.formType === 'update') {

      let existingId = this.data.selectedRecord.id;
      let updateEmployee = new Employee(existingId, login, name, salary);
      this.empApiSvc.updateEmployee(updateEmployee).subscribe({

        next: (v) => {
          console.log(v),
            this.dialogRef.close(true);
        },
        error: (e) => {
          console.log(e);
          if (e.error.errorMsg) {
            console.log('here 1');
            this.errorMsg = e.error.errorMsg;
          } else if (e.error.messages) {
            console.log('here 2');

            this.errorMsg = e.error.messages;
          }
          console.log(this.errorMsg)
        }
      });
    }
  }

  onCancel(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
