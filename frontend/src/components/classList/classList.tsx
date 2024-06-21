import React, { useState, useEffect } from "react";
import ClassCard from "./classListCard";
import "./classList.css"
import { useSubmit} from "../filterMenu/submitContext";

interface Class {
    subject : string;
    course_id : number;
    name : string;
    section_code : string;
    start_date : Date;
    end_date : Date;
    type : string;
    start : string;
    end : string;
    days : string;
    room_number : number;
    building : string;
    instructors : string;
    address : string;
}


const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reloading, setReloading] = useState<boolean>(false);
    const [first, setFirst] = useState<boolean>(true);
    const {isSubmitted, setIsSubmitted} = useSubmit();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          if(first) {
            setLoading(true);
            setFirst(false);
          } else {
            setReloading(true);
          }
          setIsSubmitted(false)
          const response = await fetch("http://localhost:5000/classes/current/nearby");
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          console.log(data.classes)
          const classes: Class[] = data.classes.map((classData: any) => ({
            subject : classData['Subject'],
            course_id : classData['Course Id'],
            name : classData['Name'],
            section_code : classData['Section Code'],
            start_date : classData['Start Date'],
            end_date : classData['End Date'],
            type : classData['Type'],
            start : classData['Start'],
            end : classData['End'],
            days : classData['Days'],
            room_number : classData['Room Number'],
            building : classData['Building'],
            instructors: classData['Instructors']
                .replace(/[\[\]'"]/g, ''),
            address : classData['Address'],
          }));
          setClasses(classes);
          setLoading(false);
          setReloading(false);

        } catch (error) {
          setError((error as Error).toString());
          setReloading(false);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [isSubmitted]);
  
    if (reloading) {
      return <div className="loading">Reloading...</div>
    }
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="loading">Error: {error}</div>;
    }
    return (
      <div className="class-container">
            {classes.map((classData, index) => (
              <ClassCard key = {index} class = {classData} />
            ))}
      </div>
    );
}

export default ClassList