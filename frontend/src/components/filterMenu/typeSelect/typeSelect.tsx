import React, { useState, useEffect } from "react";
import { useSubmit } from "../submitContext";
import "./typeSelect.css";

const TypeSelect: React.FC = () => {
  const typeOptions = [
    "Conference",
    "Discussion/Recitation",
    "Independent Study",
    "Internship",
    "Laboratory",
    "Laboratory-Discussion",
    "Lecture",
    "Lecture-Discussion",
    "Online",
    "Online Lab",
    "Online Lecture",
    "Packaged Section",
    "Practice",
    "Quiz",
    "Research",
    "Seminar",
    "Studio",
    "Study Abroad",
  ];
  const [types, setTypes] = useState<string[]>(() => {
    const savedTypes = localStorage.getItem("savedTypes");
    return savedTypes ? JSON.parse(savedTypes) : [];
  });
  const { setIsSubmitted } = useSubmit();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleTypeChange = (option: string) => {
    setTypes((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
    console.log(types);
  };

  useEffect(() => {
    localStorage.setItem("savedTypes", JSON.stringify(types));
  }, [types]);

  useEffect(() => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      ".subject-dropdown-option input"
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = types.includes(checkbox.value);
    });
  }, [types]);

  const sendTypesToBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ types: types }),
      });
      if (!response.ok) {
        throw new Error("Failed to send types to the backend");
      }
      console.log(types);
      const data = await response.json();
      setIsSubmitted(true);
      console.log("Backend response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="type-dropdown-wrapper">
      <div className="type-buttons-container">
        <div className="type-dropdown">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="type-dropdown-button"
          >
            {types.length > 0
              ? `${types.length} Types Selected`
              : "Select Type"}
          </button>
          {dropdownOpen && (
            <div className="type-dropdown-menu">
              {typeOptions.map((option) => (
                <label key={option} className="type-dropdown-option">
                  <input
                    type="checkbox"
                    value={option}
                    checked={types.includes(option)}
                    onChange={() => handleTypeChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
        <button onClick={sendTypesToBackend} className="type-send-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default TypeSelect;
