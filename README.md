yarn install
docker compose -up d
nest start auth
nest start chat
nest start gateway
cd apps/client
yarn dev