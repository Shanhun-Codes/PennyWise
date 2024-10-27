import { CurrencyPipe, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [NgFor, FormsModule, CurrencyPipe],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css',
})
export class GoalsComponent implements OnInit {
  payFrequencies: any[] = ['Monthly', 'Semimonthly', 'Biweekly', 'Weekly'];
  selectedFrequency: string = '';
  totalAmountOfBills: number = 0;
  billTransferAmount: number = 0;
  annualBills: number = 0;
  amountOfPays: number = 0;
  remainingPaycheckMessage: string = ''
  taxedIncome: number = 0

  frequencyMessage: string = '';
  weeklyMessage: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.totalAmountOfBills = Number(
      localStorage.getItem('totalAmountOfBills')
    );
    this.taxedIncome = Number(localStorage.getItem("taxedIncome"))
    console.log(this.totalAmountOfBills);
    this.annualBills = this.totalAmountOfBills * 12;
  }

  onFrequencyChange() {
    console.log(this.selectedFrequency);
    switch (this.selectedFrequency) {
      case 'Monthly':
        this.amountOfPays = 12;
        this.billTransferAmount = this.totalAmountOfBills;
        this.weeklyMessage = '';
        console.log(this.billTransferAmount);
        break;
      case 'Semimonthly':
        this.amountOfPays = 24;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        console.log(this.billTransferAmount);
        this.weeklyMessage = '';

        break;
      case 'Biweekly':
        this.amountOfPays = 26;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        console.log(this.billTransferAmount);
        this.weeklyMessage = '';

        break;
      case 'Weekly':
        this.amountOfPays = 48;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        this.weeklyMessage =
          "PennyWise calculates your weekly transfers based on a 48-week year. This approach ensures you'll always be ahead on your bills, providing a buffer for months with extra weeks and helping you build a small reserve over time.";
        console.log(this.billTransferAmount);
        break;
    }

    this.frequencyMessage = `To ensure you cover your bills, please transfer $${Math.ceil(
      this.billTransferAmount
    )} into a dedicated bills account with each paycheck.`;
    this.remainingPaycheckMessage = `Your estimated remaining balance per paycheck is: `
  }

  fbPostGoal(){}

  save(){}
}
