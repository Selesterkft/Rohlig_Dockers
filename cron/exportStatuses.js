import fetch from 'node-fetch';

console.log('process.env.BACKEND_URL', process.env.BACKEND_URL)

console.log('exportStatuses.js ...')
await fetch(`${process.env.BACKEND_URL}/datachange/statuses`,
{
    method: 'PUT',
    body: {}
})
console.log('... ended')
