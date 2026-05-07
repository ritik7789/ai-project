import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class EmptyStateComponent {
  @Input() title = 'No data yet';
  @Input() description = 'Create your first record to get started.';
}
