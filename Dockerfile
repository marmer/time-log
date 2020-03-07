FROM node:12

VOLUME /opt/ws
WORKDIR /opt/ws
RUN ["npm", "install", "-g", "firebase-tools"]

EXPOSE 9005
CMD /bin/bash
