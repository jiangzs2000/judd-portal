call npm run build:integration
::call npm run build:prod

call pscp -i club.ppk -r dist root@192.168.1.13:/var/web