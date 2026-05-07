import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss'
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'Please try again.';
  @Input() retryLabel = 'Retry';
  @Output() retry = new EventEmitter<void>();
}
