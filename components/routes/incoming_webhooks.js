var exec = require('child_process').execFile;

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

        exec("PGPASSFILE=/workdir/.pgpass psql -h ec2-174-129-255-59.compute-1.amazonaws.com -U uzzgeqgptzfgrx -d d7o70knkceadu8 -c \"INSERT INTO \"nodel_officer_details\" (apex_ministry_dept_state, parent_organisation, org_code, org_name, contact_address1, contact_address2, contact_address3, pincode, pg_officer_designation, organisation_levels) VALUES ('BSES Rajdhani / Yamuna Power Ltd','Department of Power','BSESP','BSES Rajdhani / Yamuna Power Ltd','BSES Bhavan','Nehru Place','New Delhi','110019','Chief Executive Officer',4);\"", function(err, data) {  
            console.log(err)
            console.log(data.toString());
            
            result = {
                error = err,
                data = data.toString()
            }
            
            res.status(200).send(result);
        });  
    });

}
