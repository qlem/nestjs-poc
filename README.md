# NestJS PoC
This Poc is composed of two NestJS APIs with their dedicated database and an API gateway.

## How to start
### Databases
```
$> docker-compose up -d
```

### API books
```
$> cd api-books
$> npm i
$> npx prisma migrate dev
$> nest start
```

### API libraries
```
$> cd api-libraries
$> npm i
$> npx prisma migrate dev
$> nest start
```

### API Gateway
```
$> cd api-gateway
$> npm i
$> npm run start
```
