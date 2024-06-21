import pandas as pd
import datetime as dt
import pytz
from pymongo import MongoClient
from config import MAPS_KEY
import requests
import googlemaps
import json

time_zone = pytz.timezone("America/Chicago")


# Returns the current day of the week
def currentDay():
    curr_day = dt.datetime.today().weekday()
    days = ["M", "T", "W", "R", "F", "S", "U"]
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
    return dt.time(int(times[0]), int(times[1]), int(times[2]), tzinfo=time_zone)


# Converts a datetime object to a time objecf
def convertDTtoTime(datetime: dt.datetime):
    return dt.time(datetime.hour, datetime.minute, tzinfo=time_zone)


def convertDTtoDate(datetime: dt.datetime):
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


# Uses Google Places API to find address of building
def getAddressFromBuilding(building):
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress",
    }
    data = {
        "textQuery": building,
        "pageSize": 10,
        "locationBias": {
            "circle": {
                "center": {"latitude": 40.1061711, "longitude": -88.22693509999999},
                "radius": 3.0,
            }
        },
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response and response.json():
        return response.json()["places"][0]["formattedAddress"]
    else:
        return ""


# Adds the address of every building as a new columns in the database
def addAddressToDB():
    client = MongoClient("localhost", 27017)
    db = client["tmb-classroom"]
    collection = db["tmb-classroom"]
    documents = collection.find()
    for doc in documents:
        building = doc.get("Building")
        if building:
            new_address = getAddressFromBuilding(building)
            collection.update_one(
                {"_id": doc["_id"]}, {"$set": {"Address": new_address}}
            )


# Returns all classes currently happening
def getCurrentClasses(entrees, current_time):
    filtered = []
    for entry in entrees:
        start_time_str = entry.get("Start")
        end_time_str = entry.get("End")
        days = entry.get("Days")
        if start_time_str and end_time_str:
            start_time = convertToTime(start_time_str)
            end_time = convertToTime(end_time_str)
            if (
                start_time <= current_time
                and end_time > current_time
                and isCurrentDay(days)
            ):
                filtered.append(entry)
    return filtered


# Returns all classes within a radius (in miles) of the current location
def getNearbyClasses(entrees, latitude, longitude, current_time, distance):
    gmaps = googlemaps.Client(MAPS_KEY)
    filtered = []
    latitude = 40.105960
    longitude = -88.225560
    for entry in entrees:
        address = entry.get("Address")
        if address:
            result = gmaps.distance_matrix(
                (latitude, longitude),
                address,
                mode="walking",
                departure_time=current_time,
                units="imperial",
            )
            if distance:
                val = float(
                    result["rows"][0]["elements"][0]["distance"]["text"]
                    .split(" ")[0]
                    .replace(",", "")
                )
                if val < distance:
                    entry["Distance"] = val
                    filtered.append(entry)
    return filtered


def filterBySubject(entrees, subjects):
    if len(subjects) == 0:
        return entrees
    filtered = []
    for entry in entrees:
        if entry["Subject"] in subjects:
            filtered.append(entry)
    return filtered


def filterByType(entrees, types):
    if len(types) == 0:
        return entrees
    filtered = []
    for entry in entrees:
        if entry["Type"] in types:
            filtered.append(entry)
    return filtered
