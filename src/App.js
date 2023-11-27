import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    selectedCategory: "",
    selectedSector: "",
    agreeToTerms: false,
  });

  const [sectorOptions, setSectorOptions] = useState({});
  const [details, setDetails] = useState([]);

  
  const categoryOptions = Object.keys(sectorOptions);

  useEffect(() => {
    axios
    .get("https://sector-api.vercel.app/api/sectors")
      .then((response) => {
        setSectorOptions(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching sector options:", error);
      });
  }, []);

  useEffect(() => {
  
    axios
    .get("https://sector-api.vercel.app/api/uploads")
      .then((response) => {
        setDetails(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching sector options:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCategory: category,
      selectedSector: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Custom validation for checkbox
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms before saving.");
      return;
    }

    axios
      .post("http://sector-api.vercel.app/api/uploads", formData)
      .then((response) => {
        toast.success("Data has been sent!");
        resetForm();
      })
      .catch((error) => {
        console.error("Error saving form data:", error);
      });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      selectedCategory: "",
      selectedSector: "",
      agreeToTerms: false,
    });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const deletedEntry = details[index];

      axios
        .delete(`https://sector-api.vercel.app/api/uploads/${deletedEntry.id}`)
        .then((response) => {
          setDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
          toast.success("Entry deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting entry:", error);
        });
    }
  };

  const handleEdit = (index) => {
    const editedEntry = details[index];
    setEditModalData(editedEntry);
    setEditModalOpen(true);
  };
  
  const [setEditModalOpen] = useState(false);
  const [setEditModalData] = useState(null);

  return (
    <>
      <div className="container mx-auto p-8 h-screen bg-green-50">
        <h1 className="text-3xl font-bold mb-5 text-center">
          Please enter your name and pick the Sectors you are currently involved
          in.
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-md shadow-2xl rounded-2xl m-auto  p-5 bg-zinc-50"
        >
          <label className="flex flex-col mb-4">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded"
            />
          </label>
          <div className="flex mb-4">
            <label className="flex-1 mr-2">
              <span className="text-gray-700">Sector:</span>
              <select
                name="selectedCategory"
                value={formData.selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Select a sector</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            {formData.selectedCategory && (
              <label className="flex-1 ml-2">
                <span className="text-gray-700">Sub-Sector:</span>
                <select
                  name="selectedSector"
                  value={formData.selectedSector}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Select a sector</option>
                  {sectorOptions[formData.selectedCategory].map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <label className="block mb-4">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">Agree to Terms</span>
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Save
          </button>
        </form>
        {details.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-3 mt-5">Uploaded Entries:</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2">Name</th>
                <th className="p-2">Sector</th>
                <th className="p-2">Sub-Sector</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {details.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{entry.name}</td>
                  <td className="p-2">{entry.selectedCategory}</td>
                  <td className="p-2">{entry.selectedSector}</td>
                  <td className="p-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No entries</p>
      )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default App;