from flask import Flask, request
from flask_cors import cross_origin

app = Flask(__name__)


@app.route("/api/v1/homepage/events", methods=["GET", "POST"])
@cross_origin()
def events():
    if request.method == "GET":
        return {
            "events": [
                {
                    "id": 1,
                    "description": "description1",
                    "tags": [1],
                    "icon": {
                        "name": "bib.svg",
                        "color": "#2a82a8",
                    },
                    "factors": [{"id": 1, "value": 5}, {"id": 2, "value": -3}],
                    "activity_id": 1,
                    "created": "1712605504",
                    "finished": "1712605504",
                },
                {
                    "id": 2,
                    "description": "description2",
                    "tags": [1, 2],
                    "icon": {
                        "name": "bob.svg",
                        "color": "#c26336",
                    },
                    "factors": [],
                    "activity_id": 2,
                    "created": "1713616236",
                    "finished": "",
                },
            ],
        }
    elif request.method == "POST":
        print(request.json)
        return {"status": "OK"}


@app.route("/api/v1/homepage/tasks", methods=["GET", "POST", "PUT"])
@cross_origin()
def tasks():
    if request.method == "GET":
        return {
            "tasks": [
                {
                    "id": 1,
                    "name": "name1",
                    "description": "description1",
                    "tags": [1],
                    "status": "not done",
                    "deadline": "1713587598",
                    "factors": [],
                    "created": "1712605504",
                },
                {
                    "id": 2,
                    "name": "name2",
                    "description": "description2",
                    "tags": [1, 2],
                    "status": "not done",
                    "deadline": "1712605504",
                    "factors": [],
                    "created": "1712605504",
                },
                {
                    "id": 3,
                    "name": "name3",
                    "description": "description3",
                    "tags": [2],
                    "status": "not done",
                    "deadline": "1713473998",
                    "factors": [],
                    "created": "1712605504",
                },
            ],
        }
    elif request.method == "POST":
        print(request.json)
        return {"status": "OK"}
    elif request.method == "PUT":
        print(request.json)
        return {"status": "OK"}


@app.route("/api/v1/homepage/tags", methods=["GET", "POST"])
@cross_origin()
def tags():
    if request.method == "GET":
        return {
            "tags": [
                {"id": 1, "name": "tag1", "visible": True},
                {"id": 2, "name": "tag2", "visible": True},
                {"id": 3, "name": "tag3", "visible": False},
            ]
        }
    elif request.method == "POST":
        print(request.json)
        return {"status": "OK"}


@app.route("/api/v1/homepage/factors", methods=["GET", "POST"])
@cross_origin()
def factors():
    if request.method == "GET":
        return {
            "factors": [
                {
                    "id": 1,
                    "name": "factor1",
                    "visible": True,
                },
                {
                    "id": 2,
                    "name": "factor2",
                    "visible": True,
                },
                {
                    "id": 3,
                    "name": "factor3",
                    "visible": True,
                },
                {
                    "id": 4,
                    "name": "factor4",
                    "visible": True,
                },
                {
                    "id": 5,
                    "name": "factor5",
                    "visible": True,
                },
            ]
        }
    elif request.method == "POST":
        print(request.json)
        return {"status": "OK"}


@app.route("/api/v1/statistics/activity_duration", methods=["GET", "POST"])
@cross_origin()
def duration():
    return {
        "activities": [
            {"id": "activity_name1", "value": 10},
            {"id": "activity_name2", "value": 20},
            {"id": "activity_name3", "value": 30},
            {"id": "activity_name4", "value": 40},
        ],
    }


@app.route("/api/v1/statistics/wheel", methods=["GET"])
@cross_origin()
def wheel():
    return {
        "factors": [
            {1: 5},
            {
                2: 3,
            },
            {3: 8},
            {4: 2},
            {5: 0},
        ],
    }


@app.route("/api/v1/statistics/event_count", methods=['GET'])
@cross_origin()
def count():
    return [
        {
            "day": "2024-05-18",
            "value": 5,
        },
        {
            "day": "2024-05-20",
            "value": 5,
        },
        {
            "day": "2024-05-03",
            "value": 5,
        },
        {
            "day": "2024-05-15",
            "value": 5,
        },
        {
            "day": "2024-05-21",
            "value": 5,
        }
    ]


@app.route("/api/v1/homepage/activities", methods=["GET", "POST"])
@cross_origin()
def activities():
    if request.method == "GET":
        return {
            "activities": [
                {
                    "id": 1,
                    "name": "name1",
                    "icon": {
                        "name": "bib.svg",
                        "color": "#2a82a8",
                    },
                    "visible": True,
                },
                {
                    "id": 2,
                    "name": "name2",
                    "icon": {
                        "name": "bob.svg",
                        "color": "#82a2a8",
                    },
                    "visible": True,
                },
            ]
        }
    elif request.method == "POST":
        print(request.json)
        return {"status": "OK"}


if __name__ == "__main__":
    app.run(port=8000)
