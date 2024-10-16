import { Component, inject, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../interface/employee';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from '../../service/employee.service';
import { Subscription } from 'rxjs';
import { SharedComponentService } from '../../shared/shared-component/shared-component.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material-module';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [ReactiveFormsModule,MaterialModule],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css'
})
export class ListEmployeeComponent {

  private sharedService = inject(SharedComponentService)
  private clickEventsubscription: Subscription;

  columnAttribut: string[] = ['firstName', 'lastName', 'age', 'email', 'dob', 'address', 'imageUrl', 'contactNumber'];
  displayedColumns: string[] = [...this.columnAttribut,'action'];
  dataSource: any;
  data!: Employee[];

  employeeService = inject(EmployeeService)
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog: MatDialog) {
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getEmployees();
    })
  }
  ngOnInit(): void {
    this.getEmployees();
  }

  ngAfterViewInit() {
    this.getEmployees()
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.data = employees
        this.dataSource = new MatTableDataSource<any>(this.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error: (err: Error) => {
        console.log(err)
      }
    })
  }
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filvalue;
  }

  editEmployee(id: any) {
    this.OpenDialog('1000ms', '600ms', id)
  }

  deleteEmployee(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.removeEmployee(id).subscribe({
          next: () => {
            console.log("success")
            this.getEmployees()
          }, error: (err: Error) => {
            console.log(err)
          }
        })
        Swal.fire({
          title: "Deleted!",
          text: "Your employee has been deleted.",
          icon: "success"
        });
      }
    });
  }

  OpenDialog(enteranimation: any, exitanimation: any, id: any) {
    this.dialog.open(EmployeeModalComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: "50%",
      data: {
        employeeId: id
      }
    })
  }

}
