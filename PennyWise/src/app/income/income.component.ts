import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent {
  income: any = null;
  taxedIncome: number = 0;

  constructor(private router: Router) {}

  calculateIncome(income: number) {
    if (this.income) this.taxedIncome = income - income * 0.22;
    localStorage.setItem('taxedIncome', this.taxedIncome.toString());
    this.router.navigate(['/bills']);
  }
}
