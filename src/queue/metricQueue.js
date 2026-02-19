class MetricQueue{
    constructor(){
        this.queue=[];
    }

    enqueue(metric){
        this.queue.push(metric);
    }

    dequeue(){
        return this.queue.shift();
    }

    dequeueBatch(size){
        const batch = this.queue.splice(0,size);
        return batch;
    }
    size(){
        return this.queue.length;
    }

    isEmpty(){
        return this.queue.length === 0;
    }
}

module.exports = new MetricQueue();