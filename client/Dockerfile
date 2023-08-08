# Choose the Image which has Node installed already
FROM node:alpine

WORKDIR /app
COPY ./ ./
RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]