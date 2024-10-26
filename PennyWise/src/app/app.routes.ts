import { provideRouter } from '@angular/router';
import { BillsComponent } from './bills/bills.component';
import { IncomeComponent } from './income/income.component';
import { GoalsComponent } from './goals/goals.component';

export const routes = [
  {
    path: '',
    component: IncomeComponent,
  },
  {
    path: 'bills',
    component: BillsComponent,
  },
  {
    path: 'goals',
    component: GoalsComponent,
  },
];

export const AppRoutesProvider = [provideRouter(routes)];
