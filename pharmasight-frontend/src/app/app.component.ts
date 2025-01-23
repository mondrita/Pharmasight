import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'pharmasight-frontend';
  ngOnInit() {
    console.log('app component');
    localStorage.removeItem('divisionId');
    localStorage.removeItem('tabType');
    localStorage.removeItem('genericData');
  }
}
