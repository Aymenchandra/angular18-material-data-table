import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../interface/employee';
import Swal from 'sweetalert2';
import { SharedComponentService } from '../../shared/shared-component/shared-component.service';
import { MaterialModule } from '../../shared/material-module';
@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [    
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.css'
})
export class EmployeeModalComponent {

  private  employeeService = inject(EmployeeService)
  private formBuilder = inject(FormBuilder)
  private sharedService= inject(SharedComponentService)

  editdata: any;
  submitted: boolean = false;
  employeeForm : FormGroup = this.formBuilder.group({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    age: new FormControl("", Validators.required),
    salary: new FormControl("", Validators.required),
    dob: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    contactNumber: new FormControl("", Validators.required),
    imageUrl: new FormControl("", Validators.required),
  }); 
  constructor(public dialogref: MatDialogRef<EmployeeModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // fetch from employee  
    if (this.data.employeeId != null && this.data.employeeId != '') {
      this.getEmployeeById(this.data.employeeId);
    }
  }

  getEmployeeById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((employee: Employee) => {
      this.employeeForm.patchValue(employee)
      this.editdata = employee;
    });
  }

  // handle upload file
  onFileSelected(event : any){
    this.f['imageUrl'].setValue(event.target.files[0].name)
  }

  get f() {
    return this.employeeForm.controls;
  }

  // submit forms for employee editing and registration
  onSubmit() {
    this.submitted = true;
    console.log(this.employeeForm.value)
    // Invalid forms (inputs are required)
    if (this.employeeForm.invalid) {
      return;
    }
    // Condition employee already existed (edit employee)
    if (this.data.employeeId != null && this.data.employeeId != ''){
      this.employeeService.updateEmployee(this.data.employeeId,this.employeeForm.value).subscribe({
        next: () => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your Employee has been updated",
            showConfirmButton: false,
            timer: 1500
          });
          // get new list after registration
          this.sharedService.sendClickEvent()
          // close dialog
          this.dialogref.close();
        }, error: (err: Error) => {
          console.log(err)
        }
      })
    } 
    // Condition Add new employee 
    else {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: () => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your Employee has been saved",
            showConfirmButton: false,
            timer: 1500
          });
          // get new list after registration
          this.sharedService.sendClickEvent()
          // close dialog
          this.dialogref.close();
        }, error: (err: Error) => {
          console.log(err)
        }
      })
    } 
  }

}
