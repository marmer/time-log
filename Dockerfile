FROM node:12

VOLUME /opt/ws
WORKDIR /opt/ws
RUN ["npm", "install", "-g", "firebase-tools"]

EXPOSE 9005
EXPOSE 5000
CMD /bin/bash

# docker build -t firebase-tools .
# docker run -ti -v "$(PWD):/opt/ws" -p 9005:9005 -p 5000:5000 firebase-tools
