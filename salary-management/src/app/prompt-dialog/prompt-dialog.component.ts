import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent {

  type: string ='';
  title: string = '';
  message: string = '';
  confirmButtonText: string = '';
  cancelButtonText: string = '';
  errorButtonText: string = '';

  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Update view with given values
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.confirmButtonText = data.confirmButtonText;
    this.cancelButtonText = data.cancelButtonText;
    this.errorButtonText = data.errorButtonText;
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
