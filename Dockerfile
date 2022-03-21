FROM node:9-slim
WORKDIR /usr/src/app
COPY package.json /app
RUN npm install
COPY . /usr/src/app
EXPOSE 3050
CMD ["npm","start"]