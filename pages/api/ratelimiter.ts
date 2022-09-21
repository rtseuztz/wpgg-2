import { select_option } from "svelte/internal";
type callback = () => any
export default class limiter {

    private execs: number;
    private seconds: number;
    //use push() and shift(), so its backwards
    private queue: callback[] = [];
    private dequeing: boolean = false;
    private execsThisMinute: number = 0;
    private timeBetween: number;
    constructor(execs: number, seconds: number) {
        this.execs = execs;
        this.seconds = seconds
        this.timeBetween = 1000 * seconds / execs
    }
    private readonly sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    addFunction(callback: () => any) {
        this.queue.push(callback);
        this.checkTriggerQueue();
    }
    private checkTriggerQueue() {
        if (this.dequeing)
            return;
        else {
            this.startQueue();
        }
    }
    private async startQueue() {
        this.dequeing = true;
        let execsThisMinute = this.execs;
        let totalExecutions = 0;
        while (this.queue.length > 0) {
            const start = new Date().getTime()
            while (execsThisMinute) {
                const callback: any = this.queue.shift()
                console.log("waiting")
                if (callback) {
                    // const resp = await fetch(obj.query);
                    // const game = await resp.json();
                    // obj.callback();
                    await this.sleep(this.timeBetween)
                    callback();
                } else {
                    break;
                }
                console.log("ran exececution, execs left is " + execsThisMinute)
                totalExecutions++;
                execsThisMinute--;
                console.log("total executions is " + totalExecutions);
            }
            if (this.queue.length > 0) {
                console.log("about to wait");
                await this.sleep((this.seconds * 60 * 1000) - (new Date().getTime() - start));
                console.log("Done waiting");
                execsThisMinute = this.execs;
            }
        }
        this.dequeing = false;

    }
}