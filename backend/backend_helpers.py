import pandas as pd
import datetime as dt
import pytz
from pymongo import MongoClient

time_zone = pytz.timezone("America/Chicago")

# Returns the current day of the week
def currentDay():
    curr_day = dt.datetime.today().weekday()
    days  = ["M", "T", "W", "R", "F", "S", "U"]
    return days[curr_day]

# Converts date string to Date object
def convertToDate(date):
    if type(date) != str:
        return dt.date(2024, 4, 30)
    split = date.split("-")
    year = int(split[0])
    month = int(split[1])
    day = int(split[2][0:-1])
    return dt.date(year, month, day)

# Converts time to Time object
def convertToTime(time):
    times = time.split(":")
    return dt.time(int(times[0]), int(times[1]), int(times[2]), tzinfo = time_zone)
    
# Converts a datetime object to a time objecf
def convertDTtoTime(datetime : dt.datetime):
    return dt.time(datetime.hour, datetime.minute, tzinfo = time_zone)

def convertDTtoDate(datetime : dt.datetime):
    return dt.date(datetime.year, datetime.day, datetime.minute)

# Returns true if a class is happening on the current day
def isCurrentDay(days):
    return currentDay() in days

# Converts dataframe's columns for comparisons 
def convertDfToDT(df):
    df["Start Date"] = df["Start Date"].apply(convertToDate)
    df["End Date"] = df["End Date"].apply(convertToDate)
    df["Start"] = df["Start"].apply(convertToTime)
    df["End"] = df["End"].apply(convertToTime)
    df["Correct Day"] = df["Days"].apply(isCurrentDay)
    return df