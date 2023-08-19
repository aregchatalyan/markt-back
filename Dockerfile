FROM node:18-alpine

RUN mkdir -p /home/apps/markt-server

WORKDIR /home/apps/markt-server

COPY package.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3030

CMD ["npm", "start"]
