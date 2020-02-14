#!/bin/bash
apt-get update -y
apt-get upgrade -y
# apt-get dist-upgrade -y
# apt-get autoremove -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
apt-get install -y nodejs
ln -s /usr/bin/nodejs /usr/bin/node
cd /home/ubuntu
git clone https://github.com/roeniss/amazon-sqs-handson-for-non-cs
cd amazon-sqs-handson-for-non-cs
npm install
cp sqs_node.service /lib/systemd/system/sqs_node.service
# systemctl daemon-reload
systemctl start sqs_node
systemctl enable sqs_node