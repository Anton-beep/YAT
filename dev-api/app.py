from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)


@app.route('/api/v1/homepage/events', methods=['GET'])
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
                    "factors": [
                        {
                            "id": 1,
                            "value": 16
                        },
                        {
                            "id": 2,
                            "value": 15
                        }
                    ],
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
                    "factors": [
                        {
                            "id": 1,
                            "value": 10
                        }
                    ],
                    "activity_id": 2,
                    "created": "1712605504",
                    "finished": "1712605504",
                },
            ],
        }


@app.route('/api/v1/homepage/tags', methods=['GET'])
@cross_origin()
def tags():
    if request.method == "GET":
        return {
            "tags": [
                {
                    "id": 1,
                    "name": "tag1",
                    "visible": True
                },
                {
                    "id": 2,
                    "name": "tag2",
                    "visible": True
                },
                {
                    "id": 3,
                    "name": "tag3",
                    "visible": False
                },
                {
                    "id": 3,
                    "name": "tag3",
                    "visible": False
                },
                {
                    "id": 3,
                    "name": "tag3",
                    "visible": False
                },
                {
                    "id": 3,
                    "name": "tag3",
                    "visible": False
                }
            ]
        }


@app.route('/api/v1/homepage/factors', methods=['GET'])
@cross_origin()
def factors():
    return {
        "factors":
            [
                {
                    "id": 1,
                    "name": "factor1",
                    "visible": True,
                },
                {
                    "id": 2,
                    "name": "factor2",
                    "visible": True,
                }
            ]
    }


@app.route('/api/v1/homepage/activities', methods=['GET'])
@cross_origin()
def activities():
    return {
        "activities": [
            {
                "id": 1,
                "name": "name1",
                "icon": {
                    "name": "bib.svg",
                    "color": "#2a82a8",
                },
                "visible": True
            },
            {
                "id": 2,
                "name": "name2",
                "icon": {
                    "name": "bob.svg",
                    "color": "#82a2a8",
                },
                "visible": True
            }
        ]
    }


if __name__ == '__main__':
    app.run(port=8000)
