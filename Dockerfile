FROM node:24-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG APP
RUN npx nest build ${APP}

FROM node:24-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
ARG APP
COPY --from=build /usr/src/app/dist/apps/${APP} ./dist
USER node
CMD ["node", "dist/main.js"]
