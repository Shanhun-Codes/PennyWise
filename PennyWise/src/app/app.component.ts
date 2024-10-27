import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IncomeComponent } from './income/income.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, IncomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PennyWise';
}
