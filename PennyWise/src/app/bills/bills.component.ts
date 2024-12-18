import { CurrencyPipe, KeyValuePipe, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { get, onValue, push, ref, set } from 'firebase/database';
import { database } from '../../../fb.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, KeyValuePipe],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css',
  providers: [DataService],
})
export class BillsComponent implements OnInit {
  bills: any[] = [];
  billName: any = '';
  billAmount: any = null;
  taxedIncome: number = Number(localStorage.getItem('taxedIncome')) || 0;
  totalAmountOfBills: number = 0;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.fbGetData();
  }

  fbGetData() {
    const dbRef = ref(database, '/bills/0');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.bills = Object.entries(data).map(([name, amount]) => ({
          name,
          amount: Number(amount),
        }));

        // Calculate total amount of bills
        this.totalAmountOfBills = this.bills.reduce(
          (total, bill) => total + bill.amount,
          0
        );
        this.cdr.detectChanges();
      }
    });
  }

  fbPostData(billName: string, billAmount: number) {
    if (!billName || !billAmount) {
      console.error('Bill name and amount are required');
      return;
    }

    // Capitalize the first letter of the bill name
    const capitalizedBillName =
      billName.charAt(0).toUpperCase() + billName.slice(1);

    // Round up the bill amount to the nearest dollar
    const roundedBillAmount = Math.ceil(billAmount);

    const dbRef = ref(database, '/bills/0');

    get(dbRef)
      .then((snapshot) => {
        const currentBills = snapshot.val() || {};

        // Create a new object with only non-numeric keys
        const cleanedBills: Record<string, number> = {};
        Object.keys(currentBills).forEach((key) => {
          if (isNaN(Number(key))) {
            cleanedBills[key] = currentBills[key];
          }
        });

        // Add the new bill with capitalized name and rounded amount
        cleanedBills[capitalizedBillName] = roundedBillAmount;

        // Update the database
        set(dbRef, cleanedBills)
          .then(() => {
            this.billName = '';
            this.billAmount = null;
            this.fbGetData();
          })
          .catch((error) => {
            console.error('Error adding new bill:', error);
          });
      })
      .catch((error) => {
        console.error('Error reading current bills:', error);
      });
  }
  fbDeleteBill(billName: string) {
    const dbRef = ref(database, '/bills/0');

    get(dbRef)
      .then((snapshot) => {
        const currentBills = snapshot.val();

        // Remove the bill
        delete currentBills[billName];

        // Update the database
        set(dbRef, currentBills)
          .then(() => {
            console.log('Bill deleted successfully');
            this.fbGetData(); // Refresh the data
          })
          .catch((error) => {
            console.error('Error deleting bill:', error);
          });
      })
      .catch((error) => {
        console.error('Error reading current bills:', error);
      });
  }

  calculatePercentage(billAmount: number): string {
    if (this.taxedIncome <= 0 || !billAmount) return 'N/A';

    const percentage = (billAmount / (this.taxedIncome / 12)) * 100;
    const roundedPercentage = Math.round(percentage * 10) / 10;

    // return roundedPercentage.toFixed(1) + '%';
    return `${roundedPercentage.toFixed(1)}% of income`;
  }

  finished() {
    // Calculate total amount of bills
    this.totalAmountOfBills = this.bills.reduce(
      (total, bill) => total + bill.amount,
      0
    );
    localStorage.setItem(
      'totalAmountOfBills',
      this.totalAmountOfBills.toString()
    );
    this.router.navigate(['/goals']);
  }
}
