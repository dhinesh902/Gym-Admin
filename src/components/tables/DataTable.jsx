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
            let colorClass = 'bg-gray-800 text-gray-400 border border-gray-700';

            if (statusStr === 'active') {
              colorClass = 'bg-green-500/10 text-green-500 border border-green-500/20';
            } else if (statusStr === 'inactive') {
              colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
            }

            return (
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
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
      cell: (info) => <span className="text-gray-500 font-medium">{info.row.index + 1}</span>,
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
    <div className="bg-[#16181d] border border-gray-800/60 rounded-xl overflow-hidden shadow-2xl font-sans text-white">
      {/* Table Toolbar */}
      {searchPlaceholder && (
        <div className="p-4 border-b border-gray-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#16181d]">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg h-10 pl-10 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-inner"
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-gray-500 uppercase bg-[#111318] border-b border-gray-800/60 tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-bold cursor-pointer select-none hover:text-gray-300 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp className="h-3.5 w-3.5 text-[#FBBF24]" />,
                        desc: <ChevronDown className="h-3.5 w-3.5 text-[#FBBF24]" />,
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
                  className="border-b border-gray-800/60 hover:bg-gray-800/20 transition-colors text-gray-300"
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
                <td colSpan={columns.length} className="h-32 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-800/60 flex items-center justify-between bg-[#16181d]">
        <div className="text-xs font-medium text-gray-500">
          Page <span className="text-gray-300">{table.getState().pagination.pageIndex + 1}</span> of{' '}
          <span className="text-gray-300">{table.getPageCount()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
