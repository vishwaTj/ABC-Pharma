
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MedicineService } from '../../services/medicine.service';
import { SalesService } from '../../services/sales.service';
import { Medicine } from '../../models/Medicine';

@Component({
  selector: 'app-register-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register-sale.component.html',
  styleUrl: './register-sale.component.scss'
})
export class RegisterSaleComponent implements OnInit {

  medicines: Medicine[] = [];

  selectedMedicineId = '';
  quantity = 1;
  errorMessage = '';

  constructor(
    private medicineService: MedicineService,
    private salesService: SalesService,
    private dialogRef: MatDialogRef<RegisterSaleComponent>
  ) {}

  ngOnInit(): void {
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines = data.filter(m => m.quantity > 0);
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
      }
    });
  }

  get selectedMedicine(): Medicine | undefined {
    return this.medicines.find(
      m => m.id === this.selectedMedicineId
    );
  }

  get totalAmount(): number {
    return (this.selectedMedicine?.price ?? 0) * this.quantity;
  }

  registerSale(): void {
    if (!this.selectedMedicineId || this.quantity <= 0) {
      return;
    }

    if (this.quantity > (this.selectedMedicine?.quantity ?? 0)) {
      this.errorMessage = 'Insufficient stock available.';
      return;
    }

    this.salesService.registerSale(
      this.selectedMedicineId,
      this.quantity
    ).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => {
        this.errorMessage =
          error.error || 'Unable to register sale.';
        console.error('Error registering sale:', error);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
