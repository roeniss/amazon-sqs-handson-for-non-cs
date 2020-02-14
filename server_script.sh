#!/usr/bin/env bash
apt update -y
apt upgrade -y
apt dist-upgrade -y
apt autoremove -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
apt install -y nodejs
ln -s /usr/bin/nodejs /usr/bin/node
git clone https://github.com/roeniss/amazon-sqs-handson-for-non-cs
cd amazon-sqs-handson-for-non-cs
npm install
mv sqs_node.service /lib/systemd/system/sqs_node.service
systemctl start sqs_node
systemctl enable sqs_node

