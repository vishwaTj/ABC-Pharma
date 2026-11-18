import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-medicine.component.html',
  styleUrl: './add-medicine.component.scss'
})
export class AddMedicineComponent {
  medicine = {
    fullName: '',
    notes: '',
    expiryDate: '',
    quantity: 0,
    price: 0,
    brand: ''
  };

  constructor(
    private medicineService: MedicineService,
    private dialogRef: MatDialogRef<AddMedicineComponent>
  ) {}

  saveMedicine(): void {
    this.medicineService.addMedicine(this.medicine).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => console.error('Error adding medicine:', error)
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}