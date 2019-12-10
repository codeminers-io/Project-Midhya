const pg = require("pg");
const csv = require("csv-parser");
const fs = require("fs");

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
    
    webserver.get("/data/import", (req, res) => {
    try {
      var i = 1;
      const connectionString =
        "postgres://uzzgeqgptzfgrx:60831dd60ddaf75f4f19cc2f21bfc3c4b96bb5fd94cfe04f044b69fcf1e236fd@ec2-174-129-255-59.compute-1.amazonaws.com:5432/d7o70knkceadu8";
      const client = new pg.Client(connectionString);
      client.connect();

      fs.createReadStream("/workdir/dataset/NodalOfficer_Details.csv")
        .pipe(csv())
        .on("data", row => {
          if (i <= 500) {
            var row1 =
              row["Apex Ministry/Dept/State"] == undefined
                ? ""
                : row["Apex Ministry/Dept/State"].replace("'", "");
            var row2 =
              row["Parent of Organisation"] == undefined
                ? ""
                : row["Parent of Organisation"].replace("'", "");
            var row3 =
              row["org_code"] == undefined
                ? ""
                : row["org_code"].replace("'", "");
            var row4 =
              row["org_name"] == undefined
                ? ""
                : row["org_name"].replace("'", "");
            var row5 =
              row["contact_address1"] == undefined
                ? ""
                : row["contact_address1"].replace("'", "");
            var row6 =
              row["contact_address2"] == undefined
                ? ""
                : row["contact_address2"].replace("'", "");
            var row7 =
              row["contact_address3"] == undefined
                ? ""
                : row["contact_address3"].replace("'", "");
            var row8 =
              row["pincode"] == undefined
                ? ""
                : row["pincode"].replace("'", "");
            var row9 =
              row["pg_officer_desig"] == undefined
                ? ""
                : row["pg_officer_desig"].replace("'", "");
            var row10 =
              row["Organisation levels"] == undefined
                ? ""
                : row["Organisation levels"].replace("'", "");

            const query = client.query(
              "INSERT INTO \"nodel_officer_details\" (apex_ministry_dept_state, parent_organisation, org_code, org_name, contact_address1, contact_address2, contact_address3, pincode, pg_officer_designation, organisation_levels) VALUES ('" + row1 + "','" + row2 + "','" + row3 + "','" + row4 + "','" + row5 + "','" + row6 + "','" + row7 + "','" + row8 +"','" + row9 + "'," + row10 + ");"
            );
            query.on("end", () => {
              console.log("Imported...")
            });
          }

          i++;
        })
        .on("end", () => {
          client.end();
          res.status(200).send("Done");
        });
    } catch (e) {
      res.status(200).send(e);
    }
  });

}
