import React from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from "@tanstack/react-table";


import { Link } from 'react-router-dom';  


const Table = ({data, columns, showPagination, CCN , heading}) => {

    const column = React.useMemo(() => columns, [columns]);

   




    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    })

   
    
      return (
        <div className="table-container">
          <h3>{heading}</h3>
  
          <table className="table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {" "}
                          {header.column.getIsSorted() === "desc" ? (
                            <i className="fa-solid fa-arrow-down"></i>
                          ) : (
                            <i className="fa-solid fa-arrow-up"></i>
                          )}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
  
          {showPagination && (
            <div className="table-pagination">
              <button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Prev
              </button>
              <span>
                {`${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
              </span>
              <button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
}

export default Table
