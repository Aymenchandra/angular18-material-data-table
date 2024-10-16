import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interface/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient)
  private apiUrl = "https://retoolapi.dev/HYd96h/data"

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}`);
  }

  addEmployee(employee: Employee) : Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  getEmployeeById(id : number): Observable<Employee>  {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }
  
  updateEmployee(id : number,userDetails : Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`,userDetails);
  }
  
  removeEmployee(id : number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }
}
