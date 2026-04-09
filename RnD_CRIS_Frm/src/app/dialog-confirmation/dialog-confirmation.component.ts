import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriberFormComponent } from '../subscriber-form/subscriber-form.component';

export interface DialogData {
  subscriber_id?: string;
  nodal_email?: string;
  type: 'vendor' | 'subscriber';
}

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
     @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onLandingClick(): void {
    this.dialogRef.close('landing');
  }

  onSubscriberClick(): void {
    this.dialogRef.close('subscriber');
  }

}
