import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee } from '../model/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];
  private groups: string[] = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Scrum Master',
    'Data Scientist',
    'System Administrator'
  ];

  constructor() {
    this.generateDummyData();
  }

  private generateDummyData(): void {
    const statuses = ['Active', 'Inactive', 'On Leave'];

    for (let i = 1; i <= 100; i++) {
      this.employees.push({
        id: i,
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(1990 + Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28)),
        basicSalary: 5000000 + Math.floor(Math.random() * 10000000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        group: this.groups[Math.floor(Math.random() * this.groups.length)],
        description: new Date()
      });
    }
  }

  getEmployees(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    sortField: string = 'id',
    sortDirection: string = 'asc'
  ): Observable<{employees: Employee[], total: number}> {
    let filtered = [...this.employees];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField as keyof Employee];
      const bValue = b[sortField as keyof Employee];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return of({
      employees: paginated,
      total: filtered.length
    }).pipe(delay(300));
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    const employee = this.employees.find(e => e.id === id);
    return of(employee).pipe(delay(300));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: this.employees.length + 1
    };
    this.employees.unshift(newEmployee);
    return of(newEmployee).pipe(delay(300));
  }

  getGroups(): string[] {
    return this.groups;
  }
}