const https = require(`./modules/https/index.js`)
const cli = require(`./modules/cli/index.js`)

const { "--id": startId, "--delta": deltaId } = cli.flags()
const maxRequests = 5;

async function task(id, delta) {
    id = parseInt(id);
    delta = parseInt(delta) || 1;

    while (true) {
        process.title = `querying: ${id}`;
        const requests = [];

        for (let i = 0; i < maxRequests; i++) {
            const currentId = id + i * delta;
            requests.push(https.get(`https://www.roblox.com/users/${currentId}/profile`));
        }

        const responses = await Promise.all(requests);
        for (let i = 0; i < responses.length; i++) {
            const description = responses[i].body.match(/(\w+)(?= is one of the millions)/);

            if (description) {
                const name = description[0];
                const currentId = id + i * delta;
                console.log(currentId, name);
            }
        }
        id += maxRequests * delta;
    }
}

task(startId, deltaId);