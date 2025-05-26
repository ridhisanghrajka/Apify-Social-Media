   FROM apify/actor-node-puppeteer-chrome
   COPY . ./
   RUN npm install --only=prod
   CMD ["node", "main.js"]
