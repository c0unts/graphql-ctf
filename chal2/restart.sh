#!/bin/bash
sudo docker stop graphdata2
sudo docker remove graphdata2
sudo docker build -t graphdata2 .
sudo docker run --name graphdata2 -d -p 4001:4001 graphdata2
