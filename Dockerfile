FROM  node:18

WORKDIR /Streamer

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "src/server.js" ]