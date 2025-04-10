import { Routes } from '@angular/router';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';


export const EMPLOYEE_ROUTES: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeAddComponent },
  { path: ':id', component: EmployeeDetailComponent }
];