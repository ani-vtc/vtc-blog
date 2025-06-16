---
tags:
  - SID
---
## Navigator.tsx
### Functionality

- Displays a dropdown for all the databases in the main [[Database]] 
- Displays each table in the currently selected database
- Displays top 20 rows of the selected
- Has functions for sorting and filtering

### Functions

```tsx
    // Fetch databases on mount
    // @param: none
    // @returns: none
    useEffect(() => const fetchDatabase = async () => {}, []); 
```

```tsx
    // Fetch tables when selectedDb changes
    // @param: none
    // @returns: none
    useEffect(() => {}. [selectedDb]);
```

```tsx
	// Fetch table data
    // @param: table: string - The name of the table to fetch data from
    // @param: page: number - The page number to fetch
    // @param: sortBy: string - The column to sort by
    // @param: sortDirection: string - The direction to sort by
    // @returns: none
    const fetchTableData = async (table: string,
								   page: number, 
								   sortBy?: string, 
								   sortDirection?: string)
```

```tsx
    // Handle table click
    // @param: table: string - The name of the table to fetch data from
    // @returns: none
    const handleTableClick = (table: string)
```

```tsx
    // Handle sort
    // @param: key: string - The column to sort by
    // @returns: none
    const handleSort = (key: string)
```

```tsx
    // Handle filter change
    // @param: key: string - The column to filter by
    // @param: value: string - The value to filter by
    // @returns: none
    const handleFilterChange = (key: string, value: string)
```

```tsx
    // Handle page change
    // @param: newPage: number - The new page number
    // @returns: none
    const handlePageChange = (newPage: number)
```


### API Calls

/api/databases
/api/tableNames/:db
/api/rows/:table/:page/:row-nums?{queryParams}

Calls to [[Vancouver School Space Finder/Express Backend]] 