import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CmsConstants } from 'src/app/cms-constants';

@Component({
  selector: 'app-create-participants',
  templateUrl: './create-participants.component.html',
  styleUrls: ['./create-participants.component.css'],
})
export class CreateParticipantsComponent implements OnInit {
  addParForm: FormGroup;
  flag = true;
  events: any[] = [];
  eventId;
  id;
  checkError: any;
  submitted = false;
  show = false;
  participant = 'Add Participant';
  constructor(
    private formBuilder: FormBuilder,
    private service: AuthServiceService,
    private router1: ActivatedRoute,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.router1.params.subscribe((params) => {
      this.id = params.page;
      if (params.page !== '0') {
        this.flag = false;
        this.participant = this.participant + ' for : ' + params.name;
        this.eventId = params.page;
      }
    });
    this.addParForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(CmsConstants.alphabetexp)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.pattern(CmsConstants.mobexp)]],
      event: ['', Validators.required],
    });
    this.getEvents();

    this.checkError = (controlName: string, errorName: string, checkSubmitted: boolean) => {
      if (checkSubmitted) {
        if (this.submitted) {
          return this.addParForm.controls[controlName].hasError(errorName);
        }
      } else {
        return this.addParForm.controls[controlName].hasError(errorName);
      }
    };
    if (!this.flag) {
      this.addParForm.controls['event'].setValidators(null);
      this.addParForm.controls['event'].updateValueAndValidity();
    }
  }
  getEvents() {
    this.show = true;
    this.service.getAllEventList().subscribe(
      (res) => {
        this.events = res.body;
        this.show = false;
      },
      (_err) => {
        this.show = false;
      }
    );
  }
  submit() {
    // if(this.addParForm.valid){
    const obj = {
      name: this.addParForm.controls['name'].value,
      email: this.addParForm.controls['email'].value,
      phoneNumber: this.addParForm.controls['phoneNo'].value,
      registrationType: '',
    };
    const arr: any[] = [];
    arr.push(obj);
    if (this.flag) {
      this.service.saveParticipentnonEvent(this.addParForm.controls['event'].value, arr).subscribe((res) => {
        if (res.httpStatus.toString() !== 'BAD_REQUEST') {
          this.snackBar.open('Participants successfully created', 'Close', { duration: 5000 });
          this.submitted = false;
        } else {
          this.snackBar.open('Duplicate Participant !!', 'Close', { duration: 5000 });
        }
        // this.router.navigate(['participants']);
      });
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const arr: any[] = [];
      arr.push(obj);

      this.service.saveParticipentnonEvent(this.eventId, arr).subscribe((res) => {
        if (res.httpStatus.toString() !== 'BAD_REQUEST') {
          this.snackBar.open('Participants successfully added in event', 'Close', { duration: 5000 });
          this.submitted = false;
        } else {
          this.snackBar.open('Duplicate Participant !!', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
