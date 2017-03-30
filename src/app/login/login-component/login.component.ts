import { Component, OnInit } from '@angular/core';

import { ShiftsService } from './shifts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  providers: [ ShiftsService ]
})
export class LoginComponent implements OnInit {

  public shifts: Array<any> = [];

  constructor(
    private shiftsService: ShiftsService
  ) {

  };

  ngOnInit() {
    this.shifts = this.shiftsService.getShifts();
  }

  selectShift(selectedShift) {
    this.shifts.forEach(shift => {
      if (shift === selectedShift) {
        shift.selected = true;
      } else {
        shift.selected = false;
      }
    });
  }

}
