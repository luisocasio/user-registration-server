# use this image
FROM node:18.10-alpine3.15
# create directory
WORKDIR /app

ENV PORT 80
# copy package.json and lock into the created app directory
COPY package*.json ./
# install dependencies
RUN npm i 
# copy everything into app directory
COPY . .
# run node against main app entry point
CMD ["node", "src/api/server.js"]