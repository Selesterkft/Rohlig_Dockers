export default class Timeout {
    constructor(timeoutInSeconds, defaultTimeOutInSeconds) {
        const addMilliSeconds = (timeoutInSeconds) ? timeoutInSeconds * 1000 : defaultTimeOutInSeconds * 1000;
        this.timeout = (new Date()).getTime() + addMilliSeconds;
    }

    isEllapsed() {
        const currentTime = (new Date()).getTime();
        return (currentTime > this.timeout);
    }
}
