import pandas as pd
import datetime as dt
import pytz

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
    if type(time) != str:
        return dt.time()
    split_space = time.split(" ")
    split = split_space[0].split(":")
    hours = int(split[0])
    minutes = int(split[1])
    if "PM" in split_space[1] and hours != 12:
        hours = (hours + 12) % 24
    return dt.time(hours, minutes, tzinfo = time_zone)
    
# Converts a datetime object to a time objecf
def convertDTtoTime(datetime : dt.datetime):
    return dt.time(datetime.hour, datetime.minute, tzinfo = time_zone)

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


# Returns all classes currently in session
def getCurrentClasses():
    df = pd.read_csv("./uiuc_fa2024_courses.csv")
    df = convertDfToDT(df)
    day = dt.date(2024, 9, 1)
    time = dt.time(9, 0, tzinfo = time_zone)
    return df.loc[(df['Start Date'] <= day) & (df['End Date'] >= day) & (df['Start'] < time) & (df['End'] >= time) & (df["Correct Day"] == True)]

df = pd.read_csv("./akul.csv")
print(getCurrentClasses())
