import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface ModalElements {
  key: string;
  label: string;
  type?: 'text' | 'number';
  required?: boolean;
  pattern?: string;
}

interface ModalData<data = any> {
  record: data;
  isEdit: boolean;
  fields: ModalElements[];
  isConfirm: boolean;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  title?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    console.log(data)
  }

  save(): void {
    if(this.data.isConfirm) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(this.data.record);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
