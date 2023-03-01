import fetch from "node-fetch";
const currentDate = new Date();

console.clear();
console.log('process.env.BACKEND_URL', process.env.BACKEND_URL)
console.log('exportStatuses.js ...')
console.log(`current time: ${currentDate}`)

try {
    fetch(`${process.env.BACKEND_URL}/rohligpl/statuses`,
        {
            method: 'PUT',
            body: {}
        }).then(() => {
            console.log('...rogligpl/statuses ended')
            fetch(`${process.env.BACKEND_URL}/transpack/shipments`,
                {
                    method: 'GET',
                    headers: {},
                    body: null
                }).then(() => {
                    console.log('...transpack/SHIPMENTS ended')
                    fetch(`${process.env.BACKEND_URL}/transpack/statuses`,
                        {
                            method: 'PUT',
                            body: {}
                        }).then(() => {
                            console.log('...transpack/statuses ended')

                        })
                        .catch((error) => {
                            console.log('... transpack statuses ended with error')
                            console.error(error);
                        })
                })
                .catch((error) => {
                    console.log('...+++36 transpack shipments ended with error')
                    console.error(error);
                })

        })
        .catch((error) => {
            console.log('... rohligpl statuses ended with error')
            console.error(error);
        })
} catch (error) {
    console.error('cron error', error)
}
