yarn install
docker compose -up d
yarn start:dev auth
yarn start:dev chat
yarn start:dev gateway
cd apps/client && yarn dev
