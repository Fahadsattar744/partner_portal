add these in .env file :

MONGODB_URL="mongodb://mongo:27017/partner_portal?retryWrites=true&w=majority"
JWT_SECRET=1d54d6337be790cee904c51acea8ac3b3cf940ad58deb8171f390f94985d3644
JWT_ACCESS_TTL='1h'
BASE_URL = http://localhost:3000
PORT=3000
REDIS_URL=redis://redis:6379



run the below commands in the terminal. But before running those commands you must have a docker desktop install on your system.
docker-compose build
docker-compose up