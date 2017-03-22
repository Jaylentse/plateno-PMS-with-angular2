import { Injectable } from '@angular/core';
import { shifts } from './shifts';

@Injectable()
export class ShiftsService {

  constructor() { }

  getShifts(): Array<any> {
    const shiftList = [];
    for (const shiftCode in shifts) {
      if (shifts.hasOwnProperty(shiftCode)) {
        shiftList.push({
          shiftCode,
          shiftName: shifts[ shiftCode ]
        });
      }
    }
    return shiftList;
  }

}
