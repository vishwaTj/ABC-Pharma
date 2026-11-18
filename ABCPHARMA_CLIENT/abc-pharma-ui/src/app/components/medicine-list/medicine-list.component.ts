
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RegisterSaleComponent } from '../register-sale/register-sale.component';

import { MedicineService } from '../../services/medicine.service';
import { AddMedicineComponent } from '../add-medicine/add-medicine.component';
import { Medicine } from '../../models/Medicine';
import { SalesHistoryComponent } from '../sales-history/sales-history.component';


@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.scss'
})
export class MedicineListComponent implements OnInit {

  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];

  displayedColumns: string[] = [
    'fullName',
    'brand',
    'expiryDate',
    'quantity',
    'price'
  ];

  searchText = '';

  constructor(
    private medicineService: MedicineService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.filteredMedicines = data;
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
      }
    });
  }

  searchMedicines(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredMedicines = this.medicines.filter(m =>
      m.fullName.toLowerCase().includes(search)
    );
  }

  getRowClass(medicine: Medicine): string {
    const today = new Date();
    const expiry = new Date(medicine.expiryDate);

    const daysRemaining =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (daysRemaining <= 30) {
      return 'expiry-warning';
    }

    if (medicine.quantity < 10) {
      return 'low-stock-warning';
    }

    return '';
  }

  openAddMedicineDialog(): void {
    const dialogRef = this.dialog.open(AddMedicineComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedicines();
      }
    });
  }

  openRegisterSaleDialog(): void {
    const dialogRef = this.dialog.open(RegisterSaleComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedicines();
      }
    });
  }

  openSalesHistoryDialog(): void {
    this.dialog.open(SalesHistoryComponent, {
      width: '900px',
      maxWidth: '95vw'
    });
  }
}
