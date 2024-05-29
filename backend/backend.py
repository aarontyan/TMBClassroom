from http import client
from flask import Flask, request, jsonify, make_response
import datetime as dt
from pymongo import MongoClient
from backend_helpers import *
import pytz
from bson.json_util import dumps, loads

app = Flask(__name__)
client = MongoClient("localhost", 27017)
db = client["tmb-classroom"]
collection = db["tmb-classroom"]
time_zone = pytz.timezone("America/Chicago")


@app.route("/")
def hello_world():
    return "Hello"


@app.route("/classes/all", methods=["GET"])
def get_all_classes():
    response = collection.find({}, {"_id": 0})
    return make_response(loads(dumps(response)), 200)


@app.route("/classes/current", methods=["GET"])
def get_current_classes():
    # current_info = dt.datetime.now(tz=time_zone)
    # current_time = dt.time(current_info.hour, current_info.minute, tzinfo=time_zone)
    current_info = dt.datetime(2024, 9, 2, tzinfo = time_zone)
    current_time = dt.time(9, 0, tzinfo = time_zone)
    entrees = collection.find(
        {"Start Date": {"$lt": current_info}, "End Date": {"$gt": current_info}},
        {"_id": 0},
    )
    result = getCurrentClasses(entrees, current_time)
    return make_response(jsonify(result), 200)

@app.route("/classes/current/nearby", methods=["GET"])
def get_current_nearby_classes():
    # current_info = dt.datetime.now(tz=time_zone)
    # current_time = dt.time(current_info.hour, current_info.minute, tzinfo=time_zone)
    current_info = dt.datetime(2024, 9, 2, tzinfo = time_zone)
    current_time = dt.time(9, 0, tzinfo = time_zone)
    current_location = "709 S Mathews Ave, Urbana, IL 61801"
    entrees = collection.find(
        {"Start Date": {"$lt": current_info}, "End Date": {"$gt": current_info}},
        {"_id": 0},
    )
    current = getCurrentClasses(entrees, current_time)
    result = getNearbyClasses(current, current_location)
    return make_response(jsonify(result), 200)