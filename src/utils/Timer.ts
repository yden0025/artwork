class Timer {
    callback: Function;
    interval: number;
    timerId: NodeJS.Timer | undefined;
    startTime: number | undefined;
    remaining: number;
    constructor(callback: Function, interval: number) {
        this.callback = callback;
        this.interval = interval;
        this.timerId = undefined;
        this.startTime = undefined;
        this.remaining = 0
    }
    start() {
        if (!this.startTime && !this.timerId) {
            this.startTime = Date.now()
            this.remaining = 0
            this.timerId = setInterval(() => { this.callback() }, this.interval);
        }
    }
    pause() {
        if (this.startTime && this.timerId) {
            this.remaining = this.interval - (Date.now() - this.startTime) % this.interval
            clearInterval(this.timerId)
            this.startTime = undefined
            this.timerId = undefined
        }
    }
    timeoutCallback() {
        this.callback();
        this.start()
    }
    resume() {
        setTimeout(() => { this.timeoutCallback() }, this.remaining);
    }
};

export { Timer };