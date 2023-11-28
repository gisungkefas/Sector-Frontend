import React, { createContext, useContext } from "react";
import axios from "axios";

const baseUrl = "http://sector-api.vercel.app";

const EntriesContext = createContext();

export const EntriesProvider = ({ children }) => {
  const getAllSectors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/sectors`);
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const getAllUploads = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/uploads`);
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const createEntries = async (formData) => {
    try {
      await axios.post(`${baseUrl}/api/uploads`, formData);
      console.log("Data has been sent!");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/uploads/${id}`);
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      await axios.put(`${baseUrl}/api/uploads/${id}`, updatedData);
      console.log("Entry has been updated!");
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  };

  return (
    <EntriesContext.Provider
      value={{
        getAllSectors,
        getAllUploads,
        createEntries,
        deleteEntry,
        updateEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntriesContext);
};