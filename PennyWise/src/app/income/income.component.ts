import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {

income: number = 0
taxedIncome: number = 0

calculateIncome(income: number){
  if (this.income) this.taxedIncome = income - (income * .22)

}

}
