class Animal {
    constructor(Pin,Pout,Tin,Tout) {
      this.speed = 0;
    }
    run(speed) {
      this.speed = speed;
      alert(`${this.name} runs with speed ${this.speed}.`);
    }
}