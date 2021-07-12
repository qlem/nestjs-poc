ARG NODE_VERSION

########## Base Stage ##########

FROM node:${NODE_VERSION} as base

ARG APP
WORKDIR /opt

RUN npm config set unsafe-perm true

COPY *.json *.js                ./
COPY .*ignore .stylelintrc      ./
COPY test/                      ./test
COPY tooling/                   ./tooling

RUN npm ci --ignore-script

COPY packages/                  ./packages
COPY apps/${APP}                ./apps/${APP}

RUN npx lerna bootstrap --scope ${APP} --include-dependencies

########## Lint/CssLint Stage ##########

FROM base as lint

ARG APP

RUN npx lerna run lint --scope ${APP}

########## Testing Stage ##########

FROM base as test

ARG APP

ENV TZ Europe/Paris

RUN npx lerna run test --scope ${APP}

########## Build Stage ##########

FROM base as build

ARG APP

RUN npx lerna run build:ci --scope ${APP}

########## Production Stage ##########

FROM node:${NODE_VERSION} as prod

ARG APP
WORKDIR /opt

COPY --from=build /opt/apps/${APP}/dist         ./
COPY --from=build /opt/apps/${APP}/node_modules ./node_modules
COPY --from=build /opt/apps/${APP}/package.json ./

CMD ["node", "index.js"]