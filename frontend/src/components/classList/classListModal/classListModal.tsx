import React from "react";
import "./classListModal.css";

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

interface ModalProps {
  classData: Class | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ classData, onClose }) => {
  if (!classData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>{classData.name}</h2>
        <p>
          <strong>Subject: </strong>
          {classData.subject}
        </p>
        <p>
          <strong>Course ID: </strong>
          {classData.course_id}
        </p>
        <p>
          <strong>Section Code: </strong>
          {classData.section_code}
        </p>
        <p>
          <strong>Type: </strong>
          {classData.type}
        </p>
        <p>
          <strong>Start Time: </strong>
          {classData.start}
        </p>
        <p>
          <strong>End Time: </strong>
          {classData.end}
        </p>
        <p>
          <strong>Days: </strong>
          {classData.days}
        </p>
        <p>
          <strong>Building: </strong>
          {classData.building}
        </p>
        <p>
          <strong>Room Number: </strong>
          {classData.room_number}
        </p>
        <p>
          <strong>Instructors: </strong>
          {classData.instructors}
        </p>
        <p>
          <strong>Address: </strong>
          {classData.address}
        </p>
      </div>
    </div>
  );
};

export default Modal;
