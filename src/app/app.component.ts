import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  bufferTime,
  filter,
  fromEvent,
  interval,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  protected timerData = new BehaviorSubject(new Date(0, 0, 0));
  protected isRunning: boolean = false;

  private destroy$ = new Subject<void>();

  @ViewChild('myBtn') myBtn!: ElementRef;

  ngAfterViewInit(): void {
    if (this.myBtn) {
      const doubleClick$ = fromEvent(this.myBtn.nativeElement, 'click');
      doubleClick$
        .pipe(
          bufferTime(300),
          filter((clicks) => clicks.length == 2)
        )
        .subscribe(() => {
          this.isRunning = false;
          this.destroy$.next();
        });
    }
  }
  startTimer() {
    this.isRunning = true;
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timerData.next(
          new Date(this.timerData.getValue().getTime() + 1000)
        );
      });
  }
  stopTimer() {
    this.isRunning = false;
    this.timerData.next(new Date(0, 0, 0));
    this.destroy$.next();
  }
  startOrStopTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }
  resetTimer() {
    this.timerData.next(new Date(0, 0, 0));
  }
}
