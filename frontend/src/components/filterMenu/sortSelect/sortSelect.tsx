import React, { useState, useEffect } from "react"
import { useSubmit } from "../submitContext"
import "./sortSelect.css"

const SortSelect: React.FC = () => {
    const sortOptions = ["Name", "Subject", "Course Id"]
    const orderOptions = ["Ascending", "Descending"]
    const [option, setOption] = useState<string>(() => {
        const savedOption = localStorage.getItem("savedOption");
        return savedOption ? savedOption : "Name";
    });
    const [order, setOrder] = useState<string>(() => {
        const savedOrder = localStorage.getItem("savedOrder");
        return savedOrder ? savedOrder : "Ascending";
    });
    const { setIsSubmitted } = useSubmit();
    const [optionDropdownOpen, setOptionDropdownOpen] = useState<boolean>(false);
    const [orderDropdownOpen, setOrderDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem("savedOption", option);
    }, [option]);

    useEffect(() => {
        localStorage.setItem("savedOrder", order);
    }, [order]);

    const sendChoicesToBackend = async () => {
        try {
            let asc = 1
            if (order == "Descending") {
                asc = -1
            }
          const response = await fetch("http://localhost:5000/api/sort", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify( {option : option, asc : asc}),
          });
          if (!response.ok) {
            throw new Error("Failed to send types to the backend");
          } 
          const data = await response.json();
          setIsSubmitted(true)
          console.log("Backend response:", data);
        } catch (error) {
          console.error("Error:", error);
        }
    };

    return (
        <div className="sort-select-wrapper">
            <div className="sort-dropdown">
                <button onClick={() => setOptionDropdownOpen(!optionDropdownOpen)} className="sort-dropdown-button">
                    {option || "Select Sort Option"}
                </button>
                {optionDropdownOpen && (
                    <div className="sort-dropdown-menu">
                        {sortOptions.map(options => (
                            <div 
                                key={options} 
                                className="sort-dropdown-option" 
                                onClick={() => { setOption(options); setOptionDropdownOpen(false); }}>
                                {options}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="order-dropdown">
                <button onClick={() => setOrderDropdownOpen(!orderDropdownOpen)} className="order-dropdown-button">
                    {order || "Select Order Option"}
                </button>
                {orderDropdownOpen && (
                    <div className="order-dropdown-menu">
                        {orderOptions.map(orders => (
                            <div 
                                key={orders} 
                                className="order-dropdown-option" 
                                onClick={() => { setOrder(orders); setOrderDropdownOpen(false); }}>
                                {orders}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={sendChoicesToBackend} className="sort-send-button">
                Submit
            </button>
        </div>
    );
    
}

export default SortSelect