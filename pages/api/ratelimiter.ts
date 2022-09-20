import { select_option } from "svelte/internal";
type queueObj = {
    query: string,
    callback: (game: any) => any
}
export default class limiter {

    private execs: number;
    private seconds: number;
    //use push() and shift(), so its backwards
    private queue: queueObj[] = [];
    private dequeing: boolean = false;
    private execsThisMinute: number = 0;
    constructor(execs: number, seconds: number) {
        this.execs = execs;
        this.seconds = seconds
    }
    private readonly sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    addFunction(query: string, callback: (game: any) => any) {
        const obj: queueObj = {
            query: query,
            callback: callback
        }
        this.queue.push(obj);
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
                const obj: queueObj = this.queue.shift() || {} as queueObj
                if (Object.keys(obj).length > 0) {
                    const resp = await fetch(obj.query);
                    const game = await resp.json();
                    obj.callback(game);
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
                await this.sleep(/*(this.seconds * 60 * 1000) - (new Date().getTime() - start)*/ 10);
                console.log("Done waiting");
                execsThisMinute = this.execs;
            }
        }
        this.dequeing = false;

    }
}