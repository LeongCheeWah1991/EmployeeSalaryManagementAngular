import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'app-employee-upload',
  templateUrl: './employee-upload.component.html',
  styleUrls: ['./employee-upload.component.scss']
})
export class EmployeeUploadComponent implements OnInit {

  title: String = '';
  message: String = '';
  uploadStatus: String = '';

  constructor(public dialogRef: MatDialogRef<EmployeeUploadComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.uploadStatus = this.data.uploadStatus;

  }

  onCancel() {
    const dialogData = {
      "type": "prompt",
      "title": "Confirm",
      "message": "Confirm cancel ongoing upload? Any data not uploaded will be lost.",
      "confirmButtonText": "Yes",
      "cancelButtonText": "No"
    }
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      let result = dialogResult;
      if (result) {
        this.dialogRef.close(false);
      }
    });
  }
}
