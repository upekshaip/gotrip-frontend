"use client";

import React from "react";
import { useMemo } from "react";

/**
 * Custom hook for client-side pagination
 * @param {Array} items - All items to paginate
 * @param {number} pageSize - Items per page
 * @param {number} currentPage - Current page (1-based)
 * @returns {object} Pagination data and helpers
 */
const usePagination = (items = [], pageSize = 12, currentPage = 1) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, safeCurrentPage, pageSize]);

  const hasNextPage = safeCurrentPage < totalPages;
  const hasPreviousPage = safeCurrentPage > 1;

  return {
    items: paginatedItems,
    currentPage: safeCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    startIndex: (safeCurrentPage - 1) * pageSize + 1,
    endIndex: Math.min(safeCurrentPage * pageSize, totalItems),
  };
};

export default usePagination;
