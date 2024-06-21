import React from "react";
import "./filterMenu.css";
import TypeSelect from "./typeSelect/typeSelect";
import SubjectSelect from "./subjectSelect/subjectSelect";
import SortSelect from "./sortSelect/sortSelect";
import DistanceSelect from "./distanceSelect/distanceSelect";

const FilterMenu: React.FC = () => {
  return (
    <div className="menu-wrapper">
      <div className="title">
        <b>Filters</b>
      </div>
      <DistanceSelect />
      <TypeSelect />
      <SubjectSelect />
      <SortSelect />
    </div>
  );
};

export default FilterMenu;
