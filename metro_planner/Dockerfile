# Choose the Image which has Node installed already
FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]