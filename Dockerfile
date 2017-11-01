FROM localhost:5000/dsapi
WORKDIR /app
COPY package.json .
RUN npm install
COPY . /app
CMD node server.js
EXPOSE 8383