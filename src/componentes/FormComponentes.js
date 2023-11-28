import React from "react";

const FormComponent = ({
  formData,
  sectorOptions,
  handleChange,
  handleCategoryChange,
  handleSubmit,
}) => {
  const categoryOptions = Object.keys(sectorOptions);

  return (
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
  );
};

export default FormComponent;