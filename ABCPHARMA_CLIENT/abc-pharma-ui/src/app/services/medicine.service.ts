import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../models/Medicine';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private apiUrl = 'https://localhost:7114/api/medicines';

  constructor(
  private http: HttpClient
) {}

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl);
  }

  addMedicine(medicine: Omit<Medicine, 'id'>): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }
}