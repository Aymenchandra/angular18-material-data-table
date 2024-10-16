import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListEmployeeComponent } from './component/list-employee/list-employee.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ListEmployeeComponent,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-material-dataTable';
}
