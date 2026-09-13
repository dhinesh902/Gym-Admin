import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export function DataTable({ columns, data, searchPlaceholder = "Search..." }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const enhancedColumns = useMemo(() => {
    const mappedColumns = columns.map(col => {
      if (col.accessorKey === 'status' || col.id === 'status') {
        return {
          ...col,
          cell: (info) => {
            const val = info.getValue() || 'Inactive';
            const statusStr = val.toString().toLowerCase();
            let colorClass = 'bg-slate-100 text-slate-700';
            
            if (statusStr === 'active') {
              colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            } else if (statusStr === 'inactive') {
              colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            }
            
            return (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                {val}
              </span>
            );
          }
        };
      }
      return col;
    });

    const hasSno = columns.some(c => c.id === 'sno' || c.header === 'S.No');
    if (hasSno) return mappedColumns;

    const snoColumn = {
      id: 'sno',
      header: 'S.No',
      cell: (info) => <span className="text-slate-500 font-medium">{info.row.index + 1}</span>,
    };

    return [snoColumn, ...mappedColumns];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="card overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface dark:bg-surface-dark">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="input-field pl-10 h-10 text-sm"
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="btn-outline text-sm h-10 px-3 flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp className="h-3 w-3" />,
                        desc: <ChevronDown className="h-3 w-3" />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-slate-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-surface dark:bg-surface-dark">
        <div className="text-sm text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
