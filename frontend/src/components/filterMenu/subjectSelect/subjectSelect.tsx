import React, { useState, useEffect } from "react"
import "./subjectSelect.css"
import { useSubmit } from "../submitContext"

const SubjectSelect: React.FC = () => {
    const subjectOptions = ['AAS', 'ABE', 'ACCY', 'ACE', 'ACES', 'ADV', 'AE', 'AFAS', 'AFRO', 'AFST', 'AGCM', 'AGED', 
    'AHS', 'AIS', 'ALEC', 'ANSC', 'ANTH', 'ARAB', 'ARCH', 'ART', 'ARTD', 'ARTE', 'ARTF', 'ARTH', 'ARTJ', 'ARTS', 'ASRM', 
    'ASST', 'ASTR', 'ATMS', 'BADM', 'BASQ', 'BCOG', 'BCS', 'BDI', 'BIOC', 'BIOE', 'BIOP', 'BSE', 'BTW', 'BUS', 'CB', 
    'CDB', 'CEE', 'CHBE', 'CHEM', 'CHIN', 'CHP', 'CI', 'CLCV', 'CMN', 'CPSC', 'CS', 'CSE', 'CW', 'CWL', 'DANC', 'EALC', 
    'ECE', 'ECON', 'EDPR', 'EDUC', 'EIL', 'ENG', 'ENGL', 'ENSU', 'ENVS', 'EPOL', 'EPSY', 'ERAM', 'ESE', 'ESL', 'ETMA', 
    'EURO', 'FAA', 'FIN', 'FLTE', 'FR', 'FSHN', 'GEOL', 'GER', 'GGIS', 'GLBL', 'GRK', 'GRKM', 'GS', 'GSD', 'GWS', 'HDFS', 
    'HEBR', 'HIST', 'HK', 'HNDI', 'HORT', 'HT', 'IB', 'IE', 'INFO', 'IS', 'ITAL', 'JAPN', 'JOUR', 'JS', 'KOR', 'LA', 'LAS', 
    'LAST', 'LAT', 'LAW', 'LEAD', 'LER', 'LING', 'LLS', 'MACS', 'MATH', 'MCB', 'MDIA', 'MDVL', 'ME', 'MILS', 'MSE', 'MUS', 
    'MUSC', 'MUSE', 'NE', 'NEUR', 'NPRE', 'NRES', 'NS', 'NUTR', 'PATH', 'PERS', 'PHIL', 'PHYS', 'POL', 'PORT', 'PS', 'PSM', 
    'PSYC', 'QUEC', 'REES', 'REL', 'RHET', 'RMLG', 'RST', 'RUSS', 'SAME', 'SCAN', 'SE', 'SHS', 'SLAV', 'SLCL', 'SOC', 'SOCW', 
    'SPAN', 'SPED', 'STAT', 'SWAH', 'TAM', 'TE', 'THEA', 'TMGT', 'TRST', 'TURK', 'UKR', 'UP', 'VCM', 'VM', 'WLOF', 'WRIT', 'YDSH']
    const [subjects, setSubjects] = useState<string[]>(() => {
        const savedSubjects = localStorage.getItem("savedSubjects");
        return savedSubjects ? JSON.parse(savedSubjects) : [];
    });
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const { setIsSubmitted } = useSubmit();

    const handleSubjectChange = (option : string) => {
        setSubjects(prevSelected =>
            prevSelected.includes(option)
                ? prevSelected.filter(item => item !== option)
                : [...prevSelected, option]
        );
    };

    useEffect(() => {
        localStorage.setItem("savedSubjects", JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>('.subject-dropdown-option input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = subjects.includes(checkbox.value);
        });
    }, [subjects]);

    const sendSubjectsToBackend = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/subjects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify( {subjects : subjects}),
          });
          if (!response.ok) {
            throw new Error("Failed to send subjects to the backend");
          }
          console.log(subjects)
          const data = await response.json();
          setIsSubmitted(true)
          console.log("Backend response:", data);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      return (
        <div className="subject-dropdown-wrapper">
            <div className="subject-buttons-container">
                <div className="subject-dropdown">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="subject-dropdown-button">
                        {subjects.length > 0 ? `${subjects.length} Subjects Selected` : "Select Subject"}
                    </button>
                    {dropdownOpen && (
                        <div className="subject-dropdown-menu">
                            {subjectOptions.map(option => (
                                <label key={option} className="subject-dropdown-option">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={subjects.includes(option)}
                                        onChange={() => handleSubjectChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={sendSubjectsToBackend} className="subject-send-button">
                    Submit
                </button>
            </div>
        </div>
    );
}

export default SubjectSelect