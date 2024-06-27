FROM node:20.14.0-alpine
USER node
WORKDIR /home/node/app
COPY --chown=node:node ./package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "start"]

