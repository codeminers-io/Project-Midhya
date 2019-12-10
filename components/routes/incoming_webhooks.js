var exec = require('child_process').execFile;
const csv = require('csv-parser');
const fs = require('fs');

module.exports = function (webserver, controller) {

    webserver.post('/botkit/receive', function (req, res) {

        // respond to Slack that the webhook has been received.
        res.status(200);

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res);

    });

    // Creates the endpoint for our webhook 
    webserver.post('/facebook/webhook', (req, res) => {

        let body = req.body;

        // Checks this is an event from a page subscription
        if (body.object === 'page') {

            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {

                // Gets the message. entry.messaging is an array, but 
                // will only ever contain one message, so we get index 0
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);
            });

            // Returns a '200 OK' response to all requests
            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }

    });
    
    webserver.get('/data/import', (req, res) => {
        try {
        fs.createReadStream('/dataset/NodalOfficer_Details.csv').pipe(csv())
            .on('data', (row) => {
                
                

            })
            .on('end', () => {
                
                res.status(200).send("Done");

            });
        }
        catch (e) {
            res.status(200).send(e);
        }
    });

}
