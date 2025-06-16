---
tags:
  - SID
---
## server.js
### Functionality

- Holds all endpoints for communicating with hosted backend

### API Endpoints


/api/databases
```ts
//Get databases from server
// @param none
// @returns: object - The databases from the server
app.get('/api/databases')
```
/api/tableNames/:db
```ts
//Get table names from database
// @param db: string - The name of the database to get table names from
// @returns: object - The table names from the database
app.get('/api/tableNames/:db')
```
/api/rows/:table/:page/:pageSize?
```ts
//Get rows from table with pagination, sorting, and filtering
// @param table: string - The name of the table to get rows from
// @param page: number - The page number to get
// @param pageSize: number - The number of rows per page
// @param sortBy: string - The column to sort by
// @param sortDirection: string - The direction to sort by
// @param filters: object - The filters to apply to the query
// @returns: object - The rows from the table
app.get('/api/rows/:table/:page/:pageSize')
```


Calls to [[Internal Backend]] 