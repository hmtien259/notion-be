# Notion HMT Backend

Backend foundation for the Notion HMT document workspace.

## Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- class-validator

## Main Scope

- document tree API
- document detail API
- create document
- create child document
- rename document
- archive document
- update document content

## Run

```powershell
npm install
npm run start:dev
```

## Environment

Use [`BE/.env`](C:/Notion%20HMT/BE/.env) with your PostgreSQL connection.

Default API:
- `http://localhost:4000`
- `http://localhost:4000/api/v1`

## Notes

- the backend is structured to support future auth and collaboration
- document content is stored separately to keep the model extensible
- nested documents are supported through parent-child relations
