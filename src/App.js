// AppContent.js
import React, { useState, useEffect } from "react";
import { useEntries, EntriesProvider } from "./context/EntriesContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormComponent from "./components/FormComponents";
import EntryListComponent from "./components/EntryListComponents";

const AppContent = () => {
  const {
    getAllSectors,
    getAllUploads,
    createEntries,
    deleteEntry,
    updateEntry,
  } = useEntries();
  const [formData, setFormData] = useState({
    name: "",
    selectedCategory: "",
    selectedSector: "",
    agreeToTerms: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [sectorOptions, setSectorOptions] = useState({});
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sectorsData = await getAllSectors();
      setSectorOptions(sectorsData);
    };

    fetchData();
  }, [getAllSectors]);

  useEffect(() => {
    const fetchData = async () => {
      const uploadsData = await getAllUploads();
      setDetails(uploadsData);
    };

    fetchData();
  }, [getAllUploads]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for checkbox
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms before saving.");
      return;
    }

    try {
      if (isEditing) {
        await updateEntry(editingId, formData);

        setDetails((prevDetails) =>
          prevDetails.map((entry) =>
            entry._id === editingId ? { ...entry, ...formData } : entry
          )
        );
        setIsEditing(false);
        setEditingId(null);
        toast.success("Data has been updated!");
      } else {
        await createEntries(formData);
        setDetails((prevDetails) => {
          return [formData, ...prevDetails];
        });
        toast.success("Data has been sent!");
        resetForm();
      }
    } catch (error) {
      console.error("Error handling submit:", error);

      toast.error("Error submitting data");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      selectedCategory: "",
      selectedSector: "",
      agreeToTerms: false,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);

      setDetails((prevDetails) =>
        prevDetails.filter((entry) => entry._id !== id)
      );

      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error handling delete entry:", error);

      toast.error("Error deleting entry");
    }
  };

  const handleEdit = (id) => {
    const entryToEdit = details.find((entry) => entry._id === id);
    setFormData({
      name: entryToEdit.name,
      selectedCategory: entryToEdit.selectedCategory,
      selectedSector: entryToEdit.selectedSector,
      agreeToTerms: entryToEdit.agreeToTerms,
    });
    setIsEditing(true);
    setEditingId(id);
  };

  const handleUpdate = async () => {
    try {
      await updateEntry(editingId, formData);

      setDetails((prevDetails) =>
        prevDetails.map((entry) =>
          entry._id === editingId ? { ...entry, ...formData } : entry
        )
      );
      setIsEditing(false);
      setEditingId(null);
      toast.success("Data has been updated!");
    } catch (error) {
      console.error("Error handling update entry:", error);
    }
  };

  return (
    <>
      <div className="container-fluid mx-auto p-8 min-h-screen bg-green-50">
        <h1 className="text-3xl font-bold mb-5 text-center">
          Please enter your name and pick the Sectors you are currently involved
          in.
        </h1>
        <FormComponent
          formData={formData}
          sectorOptions={sectorOptions}
          handleChange={handleChange}
          handleCategoryChange={handleCategoryChange}
          handleSubmit={isEditing ? handleUpdate : handleSubmit}
          isEditing={isEditing}
        />
        <EntryListComponent
          details={details}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

const App = () => {
  return (
    <EntriesProvider>
      <AppContent />
    </EntriesProvider>
  );
};

export default App;