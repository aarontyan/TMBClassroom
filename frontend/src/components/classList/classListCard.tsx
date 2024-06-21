import React, { useState } from "react";
import "./classList.css";
import Modal from "./classListModal/classListModal";

interface Class {
  subject: string;
  course_id: number;
  name: string;
  section_code: string;
  start_date: Date;
  end_date: Date;
  type: string;
  start: string;
  end: string;
  days: string;
  room_number: number;
  building: string;
  instructors: string;
  address: string;
}

interface ClassCardProps {
  class: Class;
}

const ClassCard: React.FC<ClassCardProps> = ({ class: classData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="class-card" onClick={handleCardClick}>
        <div className="class-card-header">
          <h2 className="class-card-name">{classData.name}</h2>
          <p>
            <strong>Start: </strong> {classData.start}
          </p>
          <p>
            <strong>End: </strong> {classData.end}
          </p>
        </div>
        <p>
          <strong>Location: </strong> {classData.building}{" "}
          {classData.room_number}
        </p>
        <p>
          <strong>Instructors: </strong>
          {classData.instructors}
        </p>
      </div>
      {isModalOpen && (
        <Modal classData={classData} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ClassCard;
