import { CurrencyPipe, KeyValuePipe, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { get, onValue, ref, set } from 'firebase/database';
import { database } from '../../../fb.config';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [NgFor, FormsModule, CurrencyPipe, KeyValuePipe],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css',
})
export class GoalsComponent implements OnInit {
  payFrequencies: any[] = ['Monthly', 'Semimonthly', 'Biweekly', 'Weekly'];
  selectedFrequency: string = '';
  totalAmountOfBills: any = null;
  billTransferAmount: any = null;
  annualBills: any = null;
  amountOfPays: any = null;
  remainingPaycheck: any = null;
  taxedIncome: any = null;
  goals: any[] = [];
  goalName: string = '';
  goalPercentage: any = null;
  totalPercentage: any = null;
  goalTransferAmount: any = null;
  goalAmount: any = null;

  percentageMessage: string = '';
  remainingPaycheckMessage: string = '';
  goalAmoutMessage: string = '';
  frequencyMessage: string = '';
  weeklyMessage: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.totalAmountOfBills = Number(
      localStorage.getItem('totalAmountOfBills')
    );
    this.taxedIncome = Number(localStorage.getItem('taxedIncome'));
    this.annualBills = this.totalAmountOfBills * 12;
    this.fbGetData();
    this.calculateTransferAmount(this.goalAmount);
  }

  calculateTransferAmount(goalPercentage: number): number {
    // Calculate the amount to transfer based on the goal percentage
    const transferAmount = this.remainingPaycheck * (goalPercentage / 100);

    // Round to two decimal places
    return Math.round(transferAmount * 100) / 100;
  }

  onFrequencyChange() {
    switch (this.selectedFrequency) {
      case 'Monthly':
        this.amountOfPays = 12;
        this.billTransferAmount = this.totalAmountOfBills;
        this.goalAmoutMessage = 'Amount to transfer:';
        this.weeklyMessage = '';
        this.remainingPaycheck = (this.taxedIncome - this.annualBills) / this.amountOfPays

        break;
      case 'Semimonthly':
        this.amountOfPays = 24;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        this.goalAmoutMessage = 'Amount to transfer:';
        this.weeklyMessage = '';
        this.remainingPaycheck = (this.taxedIncome - this.annualBills) / this.amountOfPays
        break;
      case 'Biweekly':
        this.amountOfPays = 26;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        this.goalAmoutMessage = 'Amount to transfer:';
        this.weeklyMessage = '';
        this.remainingPaycheck = (this.taxedIncome - this.annualBills) / this.amountOfPays
        break;
      case 'Weekly':
        this.amountOfPays = 48;
        this.billTransferAmount = this.annualBills / this.amountOfPays;
        this.goalAmoutMessage = 'Amount to transfer:';
        this.weeklyMessage =
          "PennyWise calculates your weekly transfers based on a 48-week year. This approach ensures you'll always be ahead on your bills, providing a buffer for months with extra weeks and helping you build a small reserve over time.";
          this.remainingPaycheck = (this.taxedIncome - this.annualBills) / this.amountOfPays
        break;
    }

    this.frequencyMessage = `To ensure you cover your bills, please transfer $${Math.ceil(
      this.billTransferAmount
    )} into a dedicated bills account with each paycheck.`;
    this.remainingPaycheckMessage = `Your estimated remaining balance per paycheck is: `;
  }

  fbGetData() {
    const dbRef = ref(database, '/goals/0');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      this.goals = data;
    });
  }

  fbRemoveGoal(goalName: string) {
    const dbRef = ref(database, '/goals/0');

    get(dbRef).then((snapshot) => {
      const currentGoals = snapshot.val();
      if (currentGoals && currentGoals.hasOwnProperty(goalName)) {
        delete currentGoals[goalName];

        set(dbRef, currentGoals);
      }
    });
  }

  fbPostGoal(goalName: string, goalPercentage: number) {
    if (!goalName || goalPercentage === null || goalPercentage === undefined) {
      return; // Exit if inputs are invalid
    }

    const dbRef = ref(database, 'goals/0');

    get(dbRef).then((snapshot) => {
      let currentGoals = snapshot.val() || {};

      // Capitalize the first letter of the goal name
      const capitalizedGoalName =
        goalName.charAt(0).toUpperCase() + goalName.slice(1);

      // Ensure the percentage is between 0 and 100
      const clampedPercentage = Math.min(Math.max(goalPercentage, 0), 100);

      // Calculate total percentage
      let totalPercentage = Object.values(currentGoals).reduce(
        (sum: number, value) => {
          return sum + (typeof value === 'number' ? value : 0);
        },
        0
      );
      totalPercentage += clampedPercentage;

      if (totalPercentage > 100) {
        this.percentageMessage =
          'Total percentage exceeds 100%. Please adjust your goals.';
        return;
      } else {
        // Add the new goal
        currentGoals[capitalizedGoalName] = clampedPercentage;

        // Update the database
        set(dbRef, currentGoals).then(() => {
          this.goalName = ''; // Clear input field
          this.goalPercentage = null; // Reset percentage
          this.fbGetData(); // refresh data
        });
      }
    });
  }
  
}
