FROM node:20 AS setup
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM setup AS database
COPY prisma prisma
RUN npx prisma generate

FROM database AS build
COPY . .
RUN npm run build

FROM build as exec
EXPOSE 8000
CMD ["npm", "run", "start:prod"]