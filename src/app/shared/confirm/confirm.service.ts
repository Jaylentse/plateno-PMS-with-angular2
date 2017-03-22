import { BehaviorSubject } from 'rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';


export type ConfirmFeedback = BehaviorSubject<boolean | string> & { emit?: (value: any) => void };

export interface Confirm {
  msg: string;
  ok?: string;
  cancel?: string;
  feedback: ConfirmFeedback;
}




/**
 * @description 系统确认弹窗的通信服务
 *
 * @export {EventEmitter<Confirm>} confirmListener
 * @class ConfirmService
 *
 * @author Jaylen-Tse <jaylen.tse@platenogroup.com>
 */
@Injectable()
export class ConfirmService {

  confirmListener: EventEmitter<Confirm>;

  constructor() {
    this.confirmListener = new EventEmitter<Confirm>();
  }

  generatePayload(message: string, ok?: string, cancel?: string) {
    const feedback: ConfirmFeedback = new BehaviorSubject<boolean | string>('confirm event is linstening for feedback');
    feedback.emit = feedback.next;
    const emitMesaage: Confirm = {
      msg: message,
      feedback
    };
    if (ok) {
      emitMesaage.ok = ok;
    }
    if (cancel) {
      emitMesaage.cancel = cancel;
    }
    return emitMesaage;
  }

}
