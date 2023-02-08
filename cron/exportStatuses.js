import fetch from 'node-fetch';

const currentDate = new Date();

console.clear();
console.log('process.env.BACKEND_URL', process.env.BACKEND_URL)
console.log('exportStatuses.js ...')
console.log(`current time: ${currentDate}`)
//nem kell await a fetch elé

try {
    fetch(`${process.env.BACKEND_URL}/datachange/statuses`,
    {
        method: 'PUT',
        body: {}
    }).then(() => {
        console.log('... ended')
     }).catch((error) => {
        console.log('... ended with error')
        console.error(error);
    })        
} catch (error) {
    console.error('cron error', error)
}
