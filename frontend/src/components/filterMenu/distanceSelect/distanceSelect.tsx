import React, { useState, useEffect } from "react";
import { useSubmit } from "../submitContext";
import "./distanceSelect.css";

const DistanceSelect: React.FC = () => {
  const [distance, setDistance] = useState<number | "">(() => {
    const savedDistance = localStorage.getItem("savedDistance");
    return savedDistance ? parseFloat(savedDistance) : "";
  });
  const { setIsSubmitted } = useSubmit();

  const handleDistanceChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (/^\d*\.?\d*$/.test(value) && parsedValue >= 0) {
      setDistance(parsedValue);
    } else {
      setDistance("");
    }
  };

  useEffect(() => {
    if (distance !== "") {
      localStorage.setItem("savedDistance", distance.toString());
    } else {
      localStorage.removeItem("savedDistance");
    }
  }, [distance]);

  const sendDistanceToBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/distance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ distance: distance }),
      });
      if (!response.ok) {
        throw new Error("Failed to send distance to the backend");
      }
      const data = await response.json();
      console.log("Backend response:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="distance-input-wrapper">
      <input
        type="number"
        placeholder="Enter a distance (Miles)"
        value={distance}
        onChange={(e) => handleDistanceChange(e.target.value)}
        className="distance-input-field"
      />
      <button onClick={sendDistanceToBackend} className="distance-send-button">
        Submit
      </button>
    </div>
  );
};

export default DistanceSelect;
