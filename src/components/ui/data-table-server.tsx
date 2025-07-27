"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableServerPagination } from "@/components/ui/data-table-server-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DataTableServerProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  onSearch?: () => void;
  onReset?: () => void;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}

export function DataTableServer<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  onColumnFiltersChange,
  onSearch,
  onReset,
  sorting,
  columnFilters,
}: DataTableServerProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 데이터가 유효한지 확인
  const validData = Array.isArray(data) ? data : [];
  const validColumns = Array.isArray(columns) ? columns : [];

  const table = useReactTable({
    data: validData,
    columns: validColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      onColumnFiltersChange(newFilters);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pageCount,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} onSearch={onSearch} onReset={onReset} />
      <div className="rounded-md border">
        <ScrollArea className="w-full">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-center"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {(() => {
                try {
                  const rowModel = table.getRowModel();
                  const rows = rowModel?.rows;
                  return rows && rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  );
                } catch (error) {
                  console.error("Table row model error:", error);
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        데이터를 불러오는 중 오류가 발생했습니다.
                      </TableCell>
                    </TableRow>
                  );
                }
              })()}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <DataTableServerPagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
