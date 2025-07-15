# For some reasong pnpm causes issues with sqlite3 during migrations, so I used npm

FROM node:22

WORKDIR /app

RUN corepack enable

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run migrate

EXPOSE 8050

CMD ["npm", "start"]