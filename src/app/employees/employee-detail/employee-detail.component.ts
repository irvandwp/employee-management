import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Employee } from '../model/employee.model';
import { EmployeeStateService } from '../services/employee-state.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DatePipe],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | undefined = undefined;
  isLoading = true;
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private stateService = inject(EmployeeStateService)

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployee(+id).subscribe({
        next: (employee) => {
          this.employee = employee;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2
    }).format(value).replace('IDR', 'Rp.');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'Inactive': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  }

  onBack(): void {
    const state = this.stateService.getState();
    this.router.navigate(['/employees'], {
      queryParams: {
        search: state.searchTerm,
        page: state.currentPage,
        size: state.itemsPerPage,
        sort: state.sortField,
        direction: state.sortDirection
      }
    });
  }
}