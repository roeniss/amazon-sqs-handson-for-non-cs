#!/usr/bin/env bash
sudo su
apt update -y
apt upgrade -y
apt dist-upgrade -y
apt autoremove -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
apt install nodejs
ln -s /usr/bin/nodejs /usr/bin/node
git clone https://github.com/roeniss/amazon-sqs-handson-for-non-cs
mv sqs_test.service /lib/systemd/system/
systemctl start sqs_test
systemctl enable sqs_test

