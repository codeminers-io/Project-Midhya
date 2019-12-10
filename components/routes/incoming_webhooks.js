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
        var i = 1;
        try {
        fs.createReadStream('/workdir/dataset/NodalOfficer_Details.csv').pipe(csv())
            .on('data', (row) => {
                
                if(i <= 500)
                {
                    
                    var row1 = row[0] == undefined ? '' : row[0].replace('\'', '');
                    var row2 = row[1] == undefined ? '' : row[0].replace('\'', '');
                    var row3 = row[2] == undefined ? '' : row[0].replace('\'', '');
                    var row4 = row[3] == undefined ? '' : row[0].replace('\'', '');
                    var row5 = row[4] == undefined ? '' : row[0].replace('\'', '');
                    var row6 = row[5] == undefined ? '' : row[0].replace('\'', '');
                    var row7 = row[6] == undefined ? '' : row[0].replace('\'', '');
                    var row8 = row[7] == undefined ? '' : row[0].replace('\'', '');
                    var row9 = row[8] == undefined ? '' : row[0].replace('\'', '');
                    var row10 = row[9] == undefined ? '' : row[0].replace('\'', '');
    
                    exec("PGPASSFILE=/workdir/.pgpass psql -h ec2-174-129-255-59.compute-1.amazonaws.com -U uzzgeqgptzfgrx -d d7o70knkceadu8 -c \"INSERT INTO \"nodel_officer_details\" (apex_ministry_dept_state, parent_organisation, org_code, org_name, contact_address1, contact_address2, contact_address3, pincode, pg_officer_designation, organisation_levels) VALUES ('" + row1 + "','" + row2 + "','" + row3 + "','" + row4 + "','" + row5 + "','" + row6 + "','" + row7 + "','" + row8 +"','" + row9 + "'," + row10 + ");\"", function(err, data) {  
                        console.log(err)
                        console.log(data.toString());
                    });

                }

                i++;

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
