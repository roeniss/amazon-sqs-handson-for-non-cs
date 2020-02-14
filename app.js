var express = require("express");
var app = express();
var aws = require("aws-sdk");
var bodyParser = require("body-parser");
var cron = require("node-cron");

app.use(bodyParser.urlencoded({ extended: true }));
aws.config.loadFromPath(__dirname + "/config.json");
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

const { uuid } = require("uuidv4");

const sqs = new aws.SQS();

app.get("/", (req, res) => res.render("index.html"));

app.post("/status", function(req, res) {
  const params = req.body;
  params.AttributeNames = ["ApproximateNumberOfMessages"];
  sqs.getQueueAttributes(params, function(err, data) {
    if (err) return res.json(err);
    const { ApproximateNumberOfMessages } = data.Attributes;
    res.json({ size: ApproximateNumberOfMessages });
  });
});

app.post("/req", function(req, res) {
  const params = {
    MessageBody: req.body.order || "새로운 주문!",
    QueueUrl: req.body.QueueUrl,
    DelaySeconds: 0,
    MessageGroupId: "order"
  };
  let count = req.body.count || 1;
  while (count--) {
    params.MessageDeduplicationId = uuid();
    if (count >= 0) {
      sqs.sendMessage(params, function(err, data) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
      });
      if (count == 0) {
        return res.send({ status: "good" });
      }
    }
  }
});

app.post("/rec", function(req, res) {
  const params = {
    QueueUrl: req.body.QueueUrl,
    AttributeNames: ["All"],
    VisibilityTimeout: 10
  };
  let count = req.body.count || 1;
  const result = [];
  function recAndDel() {
    count--;
    if (count >= 0) {
      sqs.receiveMessage(params, function(err, data) {
        if (!data.Messages) return res.send({ result, error: "Maybe queue is empty or something went wrong: please purge (reset queue data)" });
        result.push(data.Messages[0].Body);
        const newParams = { QueueUrl: params.QueueUrl, ReceiptHandle: data.Messages[0].ReceiptHandle };

        sqs.deleteMessage(newParams, function(err, data) {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          recAndDel();
        });
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
      });
    } else {
      return res.send({ result });
    }
  }
  recAndDel();
});

app.post("/purge", function(req, res) {
  const params = { QueueUrl: req.body.QueueUrl };
  sqs.purgeQueue(params, function(err, data) {
    if (err) return res.json(err);
    res.json(data);
  });
});

let reqEndless;
app.post("/reqEndless", function(req, res) {
  if (reqEndless) return res.send({ status: "good" });
  reqEndless = cron.schedule("*/1 * * * * *", () => {
    let i = 10;
    const params = {
      MessageBody: "새로운 주문!",
      QueueUrl: req.body.QueueUrl,
      DelaySeconds: 0,
      MessageGroupId: "order"
    };
    while (i--) {
      params.MessageDeduplicationId = uuid();
      new Promise(function(req, res) {
        sqs.sendMessage(params, function(err, data) {});
      });
    }
  });
  return res.send({ status: "good" });
});
app.post("/reqEndlessCancel", function(req, res) {
  if (!reqEndless) return res.send({ status: "good" });
  reqEndless.stop();
  reqEndless = undefined;
  return res.send({ status: "good" });
});

// Start server.
var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("AWS SQS example app listening at http://%s:%s", host, port);
});
