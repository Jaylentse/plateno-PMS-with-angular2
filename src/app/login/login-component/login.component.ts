import { Component, OnInit } from '@angular/core';

import { ShiftsService } from './shifts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  providers: [ ShiftsService ]
})
export class LoginComponent implements OnInit {

  private shifts: Array<any> = [];

  constructor(
    private shiftsService: ShiftsService
  ) {
    this.shifts = this.shiftsService.getShifts();
  };

  ngOnInit() {
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
