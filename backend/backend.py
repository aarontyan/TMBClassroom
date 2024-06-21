from http import client
from flask import Flask, request, jsonify, make_response
import datetime as dt
from pymongo import MongoClient
from backend_helpers import *
import pytz
from bson.json_util import dumps, loads
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = MongoClient("localhost", 27017)
db = client["tmb-classroom"]
collection = db["tmb-classroom"]
time_zone = pytz.timezone("America/Chicago")
latitude = 40.105960
longitude = -88.225560
types = []
subjects = []
option = "Name"
asc = 1
distance = 0.5



@app.route("/")
def hello_world():
    return "Hello"


@app.route("/classes/all", methods=["GET"])
def get_all_classes():
    response = collection.find({}, {"_id": 0})
    response_data = {"classes": loads(dumps(response)), "success": True}
    return make_response(jsonify(response_data), 200,)


@app.route("/classes/current", methods=["GET"])
def get_current_classes():
    # current_info = dt.datetime.now(tz=time_zone)
    # current_time = dt.time(current_info.hour, current_info.minute, tzinfo=time_zone)
    current_info = dt.datetime(2024, 9, 2, tzinfo = time_zone)
    current_time = dt.time(9, 0, tzinfo = time_zone)
    pipeline = [
    {
        "$match": {
            "Start Date": {"$lt": current_info},
            "End Date": {"$gt": current_info}
        }
    },
    {
        "$group": {
            "_id": {
                "Name" : "$Name",
                "Start" : "$Start",
                "End" : "$End",
                "Type" : "$Type",
                "Building" : "$Building",
                "Room Number" : "$Room Number"
            },
            "doc": {"$first": "$$ROOT"}
        }
    },
    {
        "$replaceRoot": {
            "newRoot": "$doc"
        }
    },
    {
        "$project": {
            "_id": 0
        }
    },
    {
        "$sort": {
            option : asc
        }
    }
    ]

    entrees = collection.aggregate(pipeline)
    current_filtered = getCurrentClasses(entrees, current_time)
    subject_filtered = filterBySubject(current_filtered, subjects)
    type_filtered = filterByType(subject_filtered, types)
    response_data = {"classes": type_filtered, "success": True}
    return make_response(jsonify(response_data), 200)

@app.route("/classes/current/nearby", methods=["GET"])
def get_current_nearby_classes():
    # current_info = dt.datetime.now(tz=time_zone)
    # current_time = dt.time(current_info.hour, current_info.minute, tzinfo=time_zone)
    current_info = dt.datetime(2024, 9, 2, tzinfo = time_zone)
    current_time = dt.time(9, 0, tzinfo = time_zone)
    pipeline = [
    {
        "$match": {
            "Start Date": {"$lt": current_info},
            "End Date": {"$gt": current_info}
        }
    },
    {
        "$group": {
            "_id": {
                "Name" : "$Name",
                "Start" : "$Start",
                "End" : "$End",
                "Type" : "$Type",
                "Building" : "$Building",
                "Room Number" : "$Room Number"
            },
            "doc": {"$first": "$$ROOT"}
        }
    },
    {
        "$replaceRoot": {
            "newRoot": "$doc"
        }
    },
    {
        "$project": {
            "_id": 0
        }
    },
    {
        "$sort": {
            option : asc
        }
    }
    ]
    entrees = collection.aggregate(pipeline)
    current_filtered = getCurrentClasses(entrees, current_time)
    nearby_filtered = getNearbyClasses(current_filtered, latitude, longitude, current_info, distance)
    subject_filtered = filterBySubject(nearby_filtered, subjects)
    type_filtered = filterByType(subject_filtered, types)
    response_data = {"classes": type_filtered, "success": True}
    return make_response(jsonify(response_data), 200)

@app.route('/api/location', methods=["POST"])
def receive_location():
    data = request.get_json()
    global latitude
    global longitude
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    return make_response(jsonify({'success' : True}), 200)

@app.route('/api/types', methods=["POST"])
def receive_types():
    data = request.get_json()
    global types
    types = data.get("types")
    return make_response(jsonify({'success' : True}), 200)


@app.route('/api/subjects', methods=["POST"])
def receive_subjects():
    data = request.get_json()
    global subjects
    subjects = data.get("subjects")
    return make_response(jsonify({'success' : True}), 200)

@app.route("/api/sort", methods=["Post"])
def receive_sorts():
    data = request.get_json()
    global option
    global asc
    option = data.get("option")
    asc = data.get("asc")
    print(option)
    print(asc)
    return make_response(jsonify({'success' : True}), 200)

@app.route("/api/distance", methods=["POST"])
def receive_distance():
    data = request.get_json()
    global distance
    distance = data.get("distance")
    return make_response(jsonify({'success' : True}), 200)



if __name__ == '__main__': 
    app.run(host='localhost', port = 5000)