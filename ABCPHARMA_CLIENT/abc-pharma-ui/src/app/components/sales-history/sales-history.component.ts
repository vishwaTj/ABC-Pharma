
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Sale } from '../../models/sale';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss'
})
export class SalesHistoryComponent implements OnInit {

  sales: Sale[] = [];

  displayedColumns: string[] = [
    'medicineName',
    'quantity',
    'unitPrice',
    'totalAmount',
    'soldAt'
  ];

  constructor(
    private salesService: SalesService,
    private dialogRef: MatDialogRef<SalesHistoryComponent>
  ) {}

  ngOnInit(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
