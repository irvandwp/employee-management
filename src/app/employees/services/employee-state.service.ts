import { Injectable } from '@angular/core';

interface EmployeeSearchState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeStateService {
  private state: EmployeeSearchState = {
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'id',
    sortDirection: 'asc'
  };

  getState(): EmployeeSearchState {
    return this.state;
  }

  updateState(newState: Partial<EmployeeSearchState>): void {
    this.state = { ...this.state, ...newState };
  }

  resetState(): void {
    this.state = {
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'id',
      sortDirection: 'asc'
    };
  }
}