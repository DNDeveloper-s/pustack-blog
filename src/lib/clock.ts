export class Clock {
  timezone: number;
  handSeconds: HTMLElement;
  handMinutes: HTMLElement;
  handHours: HTMLElement;
  interval?: NodeJS.Timeout;

  constructor(
    timezone: string,
    handSeconds: HTMLElement,
    handMinutes: HTMLElement,
    handHours: HTMLElement
  ) {
    this.timezone = +timezone;

    if (this.isDST(new Date())) {
      this.timezone += 1;
    }

    this.handSeconds = handSeconds;
    this.handMinutes = handMinutes;
    this.handHours = handHours;

    this.getTime();
    this.cycle();
  }

  isDST(now: Date) {
    const jan = new Date(now.getFullYear(), 0, 1);
    const jul = new Date(now.getFullYear(), 6, 1);
    const dst = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

    return now.getTimezoneOffset() < dst;
  }

  draw(hours: number, minutes: number, seconds: number) {
    const drawSeconds = (seconds / 60) * 360 + 90;
    const drawMinutes = (minutes / 60) * 360 + 90;
    const drawHours = (hours / 12) * 360 + 90;

    this.handSeconds.style.transform = `rotate(${drawSeconds}deg)`;
    this.handMinutes.style.transform = `rotate(${drawMinutes}deg)`;
    this.handHours.style.transform = `rotate(${drawHours}deg)`;

    // fix for animation bump on when clock hands hit zero
    if (drawSeconds === 444 || drawSeconds === 90) {
      this.handSeconds.style.transition = "all 0s ease 0s";
    } else {
      this.handSeconds.style.transition =
        "all 0.05s cubic-bezier(0, 0, 0.52, 2.51) 0s";
    }
  }

  getTime() {
    const now = new Date();

    const hours = now.getUTCHours() + this.timezone;
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    this.draw(hours, minutes, seconds);
  }

  cycle() {
    this.interval = setInterval(this.getTime.bind(this), 1000);
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
