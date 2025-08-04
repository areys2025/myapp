
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode); // Allow accessor function for custom rendering
  className?: string; // Class for <th> and overall column styling if needed for <td>
  headerClassName?: string;
  // Fix: Allow cellClassName to be a string or a function that returns a string
  cellClassName?: string | ((item: T) => string);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  rowClassName?: string | ((item: T) => string);
}

const Table = <T extends { id: string | number },>(
  {
    columns,
    data,
    isLoading = false,
    emptyMessage = "No data available.",
    onRowClick,
    tableClassName = "min-w-full divide-y divide-gray-200",
    theadClassName = "bg-gray-50",
    tbodyClassName = "bg-white divide-y divide-gray-200",
    rowClassName = ""
  }: TableProps<T>
): React.ReactElement => {

  const getRowClass = (item: T) => {
    let classes = onRowClick ? "cursor-pointer hover:bg-gray-50" : "";
    if (typeof rowClassName === 'function') {
      classes += ` ${rowClassName(item)}`;
    } else if (typeof rowClassName === 'string') {
      classes += ` ${rowClassName}`;
    }
    return classes.trim();
  };

  // Fix: Helper function to correctly combine cell classes
  const getCellFinalClassName = (column: Column<T>, item: T): string => {
    const baseClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-700";
    const generalColClass = column.className || "";
    const specificCellClass = typeof column.cellClassName === 'function' 
      ? column.cellClassName(item) 
      : column.cellClassName || "";
    
    return `${baseClasses} ${generalColClass} ${specificCellClass}`.replace(/\s+/g, ' ').trim();
  };


return (
  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <div className="overflow-x-auto w-full"> {/* 👈 Add this wrapper */}
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''} ${column.headerClassName || ''}`.trim()}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onRowClick && onRowClick(item)}
                className={getRowClass(item)}
              >
                
              {columns.map((column) => (
  <td
  
    key={`${item.id}-${column.header}`}
    className={getCellFinalClassName(column, item)}
  >
    {typeof column.accessor === 'function'
      ? column.accessor(item)
      : String(item[column.accessor as keyof T] ?? '')}
  </td>
))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div> 
  </div>
);

};

export default Table;