import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NotificationService } from '../../shared/components/notification/services/notification.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {
  @ViewChild('groupSearchInput') groupSearchInput?: ElementRef;
  employeeForm: FormGroup;
  groups: string[] = [];
  filteredGroups: string[] = [];
  showGroupDropdown = false;
  maxDate: string;

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  constructor() {
    const today = new Date();
    this.groups = this.employeeService.getGroups();
    this.maxDate = today.toISOString().split('T')[0];
    this.filteredGroups = [...this.groups];

    this.employeeForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, this.maxDateValidator()]],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required],
      group: ['', Validators.required],
      description: [new Date()]
    });
  }

  ngOnInit(): void {
    this.employeeForm.get('group')?.valueChanges.subscribe(value => {
      if (!value) {
        this.filteredGroups = [...this.groups];
      }
    });
  }

  maxDateValidator() {
    return (control: { value: string }) => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today ? null : { futureDate: true };
    };
  }

  openDatePicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && 'showPicker' in input) {
      input.showPicker();
    }
  }

  filterGroups(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filteredGroups = this.groups.filter(group =>
      group.toLowerCase().includes(value.toLowerCase())
    );
    this.showGroupDropdown = true;
  }

  selectGroup(group: string): void {
    this.employeeForm.get('group')?.setValue(group);
    this.showGroupDropdown = false;
    if (this.groupSearchInput) {
      this.groupSearchInput.nativeElement.value = group;
    }
  }

  hideGroup(): void {
    setTimeout(() => {
      this.showGroupDropdown = false;
    }, 200);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.notificationService.show('Please fill all required fields correctly', 'error');
      return;
    }

    this.employeeService.addEmployee(this.employeeForm.value).subscribe({
      next: () => {
        this.notificationService.show('Employee added successfully!', 'success');
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.notificationService.show('Failed to add employee', 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}