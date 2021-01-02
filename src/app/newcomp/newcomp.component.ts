import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subscription, fromEvent } from 'rxjs';
import { map, filter, buffer, debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-newcomp',
  templateUrl: './newcomp.component.html',
  styleUrls: ['./newcomp.component.css']
})
export class NewcompComponent implements OnInit {
  startTimer = 0;
  currentValue = '00:00:00';
  timerValue ;
  private currentSubscription: Subscription;
  button = document.getElementsByClassName('btnWait');
  isStart = true;

  constructor() { }

  ngOnInit(): void {

    const btnStrem$: Observable<Event> = fromEvent(this.button, 'click');
    const buff$ = btnStrem$.pipe(debounceTime(250));

    const click$ = btnStrem$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x ===2 ));

    click$.subscribe(() => {
      this.wait()
    });
  }

  start() {
    this.isStart = !this.isStart;
   
    const strem$: Observable<number> = interval(1000)

    this.currentSubscription = strem$.subscribe(v => {
      this.startTimer += 1;
      this.currentValue = this.formatValue(this.startTimer)});
  };

   private formatValue(v) {

    const hourse = Math.floor(v / 600);
    const formattedHourse = '' + (hourse > 9 ? hourse : '0' + hourse);
    const minutes = Math.floor(v / 60);
    const formattedMinutes = '' + (minutes > 9 ? minutes : '0' + minutes);
    const seconds = v % 60;
    const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);

    return `${formattedHourse}:${formattedMinutes}:${formattedSeconds}`;
}

   stop() {

    this.isStart = !this.isStart;
    this.startTimer = 0;
    this.currentValue = '00:00:00';
    this.currentSubscription.unsubscribe();

};

   reset() {

    this.startTimer = 0;
    this.currentValue = '00:00:00';
    this.currentSubscription.unsubscribe();
    this.start();

  }

   wait() {

   this.isStart = !this.isStart;
   this.currentSubscription.unsubscribe();

  }
}
