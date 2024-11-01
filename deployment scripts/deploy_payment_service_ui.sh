#!/bin/sh
today=`date +%Y-%m-%d_%H-%M-%S`
PAYMENT_SERVICE_UI_VERSION="master"

cd /var/www

pwd

#Make a Backup
sudo mv payment-service-ui payment-service-ui_$today
#Clone Repo
sudo git clone https://transsight@bitbucket.org/transsightdev/payment-service-ui.git
#checkout the appropriate version
cd payment-service-ui
sudo git checkout $PAYMENT_SERVICE_UI_VERSION

cd ..
sudo chmod -R 777 payment-service-ui

cd payment-service-ui


#Build
sudo npm install

# TODO: fix this later
# sudo cat /var/config-backups/payment-service-ui/environment.prod.ts > /var/www/payment-service-ui/src/environments/environment.prod.ts

sudo ng build --prod --aot --outputHashing=all
