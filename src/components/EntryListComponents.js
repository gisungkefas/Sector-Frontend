import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const PAGE_LIMIT = 5;

const EntryListComponent = ({ details, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  const entriesToShow = details.slice(
    currentPage * PAGE_LIMIT,
    (currentPage + 1) * PAGE_LIMIT
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 mt-5">Uploaded Entries:</h2>
      {entriesToShow.length > 0 ? (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Sector</th>
                <th className="p-2 border">Sub-Sector</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entriesToShow.map((entry, index) => (
                <tr
                  key={entry._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="p-2 border">{entry.name}</td>
                  <td className="p-2 border">{entry.selectedCategory}</td>
                  <td className="p-2 border">{entry.selectedSector}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => onEdit(entry._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(entry._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(details.length / PAGE_LIMIT)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={
              "pagination flex items-center justify-end space-x-4"
            }
            subContainerClassName={
              "pages pagination flex items-center space-x-2"
            }
            activeClassName={"active"}
          />
        </>
      ) : (
        <p>No entries</p>
      )}
    </div>
  );
};

export default EntryListComponent;
