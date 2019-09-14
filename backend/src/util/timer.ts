// Timer for reporting time taken
export class Timer {
  startTime = process.hrtime();
  name: string;

  constructor(name: string = 'Timer') {
    this.name = name;
    console.log(`[${name}] Process started...`);
  }

  print() {
    const timing = process.hrtime(this.startTime);
    console.log(
      `[${this.name}] Took ${timing[0]}s and ${(timing[1] / 1e6).toFixed(0)}ms`
    );
  }
}
