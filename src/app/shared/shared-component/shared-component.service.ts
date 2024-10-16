import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedComponentService {

  private subject = new Subject<any>();
sendClickEvent() {
  this.subject.next('');
}
getClickEvent(): Observable<any>{ 
  this.subject = new Subject<any>()
  return this.subject.asObservable();
}
}
