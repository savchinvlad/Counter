import { Component, OnInit } from '@angular/core';
import { Observable, interval, fromEvent } from 'rxjs';
import { map, filter, buffer, debounceTime, scan } from 'rxjs/operators'

@Component({
  selector: 'app-newcomp',
  templateUrl: './newcomp.component.html',
  styleUrls: ['./newcomp.component.css']
})
export class NewcompComponent implements OnInit {
  currentValue = '00:00:00';
  timerSubscription;
  button = document.getElementsByClassName('btnWait');
  isStart = true;
  currenTimerValue = 0;

  constructor() { }

  ngOnInit(): void {

    const btnStrem$: Observable<Event> = fromEvent(this.button, 'click');
    const buff$ = btnStrem$.pipe(debounceTime(300));

    const click$ = btnStrem$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2));

    click$.subscribe(() => {
      this.wait()
    });
  };

  start() {
    this.isStart = !this.isStart;
   
    this.timerSubscription = interval(1000)
    .pipe(
      scan(count => count + 1, this.currenTimerValue))
    .subscribe(v => {
      this.currenTimerValue = v;
      this.currentValue = this.formatValue(v)});
  };

   public formatValue(v) {

    const hourse = Math.floor(v / 3600);
    const formattedHourse = '' + (hourse > 9 ? hourse : '0' + hourse);
    const minutes = Math.floor(v / 60);
    const formattedMinutes = '' + (minutes > 9 ? minutes : '0' + minutes);
    const seconds = v % 60;
    const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);

    return `${formattedHourse}:${formattedMinutes}:${formattedSeconds}`;

  };

   stop() {

    this.isStart = !this.isStart;

    this.currentValue = '00:00:00';
    this.timerSubscription.unsubscribe();
    this.currenTimerValue = 0;

  };

   reset() {
     
    this.isStart = !this.isStart;

    this.currenTimerValue = 0;
    this.currentValue = '00:00:00';
    this.timerSubscription.unsubscribe();
    this.start();

  };

   wait() {

   this.isStart = !this.isStart;

   this.timerSubscription.unsubscribe();
   
  };
}
