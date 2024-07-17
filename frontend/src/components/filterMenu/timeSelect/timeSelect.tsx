import React, { useState, useEffect } from "react";
import "./timeSelect.css"
import { useSubmit } from "../submitContext";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"


const TimeSelect: React.FC = () => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const { setIsSubmitted } = useSubmit();
    const [time, setTime] = useState<Dayjs | null>(() => {
        const savedDate = localStorage.getItem("savedDate");
        return savedDate ?  dayjs(savedDate) : dayjs().tz("America/Chicago");
      });
      useEffect(() => {
        if (time != null) {
          localStorage.setItem("savedDate", time.toString());
        }})
    const sendTimeToBackend = async () => {
        try {
            console.log(time)
            console.log(time?.date())
          const response = await fetch("http://localhost:5000/api/time", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: time?.year(), month: (time?.month() ?? 0) + 1, day: time?.date(), hour: time?.hour(), minute : time?.minute()}),
          });
          if (!response.ok) {
            throw new Error("Failed to send time to the backend");
          }
          const data = await response.json();
          console.log("Backend response:", data);
          setIsSubmitted(true);
        } catch (error) {
          console.error("Error:", error);
        }
      };

    return (
        <div className="time-buttons-container">
            <div className="time-buttons-container-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    value={time}
                    onChange={(newTime) => setTime(newTime)}
                />
            </LocalizationProvider>
            <button onClick={sendTimeToBackend} className="time-send-button">
                 Submit
            </button>
            </div>
        </div>
    )

}
export default TimeSelect;
