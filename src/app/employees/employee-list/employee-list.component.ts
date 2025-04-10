import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/components/notification/services/notification.service';
import { Employee } from '../model/employee.model';
import { EmployeeService } from '../services/employee.service';
import { EmployeeStateService } from '../services/employee-state.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private stateService = inject(EmployeeStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  employees: Employee[] = [];
  totalItems = 0;
  searchForm = this.fb.group({ searchTerm: [''] });
  itemsPerPageOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    const state = this.stateService.getState();
    this.searchForm.patchValue({ searchTerm: state.searchTerm });
    this.currentPage = state.currentPage;
    this.itemsPerPage = state.itemsPerPage;
    this.sortField = state.sortField;
    this.sortDirection = state.sortDirection;

    this.loadEmployees();
    this.setupSearch();
  }

  get currentPage(): number {
    return this.stateService.getState().currentPage;
  }

  set currentPage(page: number) {
    this.stateService.updateState({ currentPage: page });
  }

  get itemsPerPage(): number {
    return this.stateService.getState().itemsPerPage;
  }

  set itemsPerPage(size: number) {
    this.stateService.updateState({ itemsPerPage: size });
  }

  get sortField(): string {
    return this.stateService.getState().sortField;
  }

  set sortField(field: string) {
    this.stateService.updateState({ sortField: field });
  }

  get sortDirection(): string {
    return this.stateService.getState().sortDirection;
  }

  set sortDirection(direction: string) {
    this.stateService.updateState({ sortDirection: direction });
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadEmployees();
      });
  }

  private getQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchForm.patchValue({ searchTerm: params['search'] });
      }
      if (params['page']) {
        this.currentPage = +params['page'];
      }
      if (params['size']) {
        this.itemsPerPage = +params['size'];
      }
      if (params['sort']) {
        this.sortField = params['sort'];
      }
      if (params['direction']) {
        this.sortDirection = params['direction'];
      }

      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    this.stateService.updateState({ searchTerm });

    this.employeeService.getEmployees(
      this.currentPage,
      this.itemsPerPage,
      searchTerm,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (data) => {
        this.employees = data.employees;
        this.totalItems = data.total;
      },
      error: (err) => {
        this.notificationService.show('Failed to load employees', 'error');
        console.error('Error loading employees:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 1;
    this.loadEmployees();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadEmployees();
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  onEdit(id: number): void {
    this.notificationService.show(`Employee ${id} is edited`, 'warning');
  }

  onDelete(id: number): void {
    this.notificationService.show(`Are you sure you want to delete employee ${id}?`, 'error');
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/employees', id]);
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
}