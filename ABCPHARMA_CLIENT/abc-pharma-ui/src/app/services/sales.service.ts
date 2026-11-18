import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'https://localhost:7114/api/sales';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  registerSale(medicineId: string, quantity: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      medicineId,
      quantity
    });
  }
}