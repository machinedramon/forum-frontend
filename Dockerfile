FROM node:20.15.1

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 9999

ENV PORT 9999

CMD ["yarn", "start"]
