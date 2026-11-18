import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MedicineListComponent } from './components/medicine-list/medicine-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MedicineListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'abc-pharma-ui';
}
