"use client"
import { useEffect, useState, ChangeEvent } from "react";
import { fetchRecentActions, Action } from "./service";

const RecentActionsPage = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    fetchRecentActions().then(setActions);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredActions = actions.filter((action) =>
    action.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedActions = filteredActions.sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.createdAT).getTime() - new Date(b.createdAT).getTime()
      : new Date(b.createdAT).getTime() - new Date(a.createdAT).getTime()
  );

  const paginatedActions = sortedActions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //const totalPages = Math.ceil(sortedActions.length / itemsPerPage);

  const totalPages = Math.ceil(sortedActions.length /itemsPerPage);

  const handlePrevious = () => {
    // Navigate to the previous page if not on the first page
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    // Navigate to the next page if not on the last page
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Recent Actions</h1>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by User ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        />
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="asc">Sort by Date (Asc)</option>
          <option value="desc">Sort by Date (Desc)</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="3">3 rows</option>
          <option value="5">5 rows</option>
          {/* <option value="25">25 rows</option>
          <option value="100">100 rows</option> */}
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">User ID</th>
            <th className="p-4 text-left">Action</th>
            <th className="p-4 text-left">Time Exit</th>
          </tr>
        </thead>
        <tbody>
          {paginatedActions.map((action) => (
            <tr key={action.id} className="bg-gray-50">
              <td className="p-4 border">{action.userId}</td>
              <td className="p-4 border">PC User has exited from the university.</td>
              <td className="p-4 border">
                {new Date(action.createdAT).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  <div className="flex items-end">
  <button
    onClick={handlePrevious}
    className={`px-4 py-2 mr-2 rounded ${
      currentPage === 1
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="px-4 py-2 bg-gray-100 border rounded">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={handleNext}
    className={`px-4 py-2 ml-2 rounded ${
      currentPage === totalPages
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
    </div>
  );
};

export default RecentActionsPage;
