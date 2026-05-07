import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss'
})
export class LoadingStateComponent {
  @Input() label = 'Loading...';
}
