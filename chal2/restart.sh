#!/bin/bash
sudo docker stop graphdata1
sudo docker remove graphdata1
sudo docker build -t graphdata1 .
sudo docker run --name graphdata1 -d -p 4000:4000 graphdata1
