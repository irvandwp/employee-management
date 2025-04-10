import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled = false;
  @Input() icon?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth: boolean = false;

  onClick = output<void>();

  get buttonClasses(): string {
    return [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.disabled ? 'btn-disabled' : '',
      this.fullWidth ? 'w-full' : ''
    ].join(' ');
  }
}