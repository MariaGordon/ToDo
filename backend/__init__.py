import json
import os
from flask import Flask, Response, request, jsonify, abort, url_for
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='', static_folder='../frontend')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
app.config.from_object('config')

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'todo.db')
db = SQLAlchemy(app)

from backend import models

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():    
    tasks = models.Task.query.all()    
    task_list = []
    for task in tasks:
        task_list.append(task.json()[0])
                   
    return  jsonify({'task': task_list}), 200 

@app.route('/todo/api/v1.0/tasks', methods=['POST'])
def create_task():    
    if not request.json or not 'description' in request.json:
        abort(400)    
    
    task = models.Task(description=request.json['description'], done=False)
    db.session.add(task)
    db.session.commit()
    return jsonify({'task':task.json()}), 201
    
@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    if not request.json:
        abort(400)    
    if not 'done' in request.json:
        abort(400)
    
    task = models.Task.query.get(task_id)
    task.done = request.json['done']
    db.session.commit()
    return jsonify({'task':task.json()}), 201

@app.route('/todo/api/v1.0/tasks', methods=['PUT'])
def update_all_tasks():
    if not request.json:
        abort(400)    
    if not 'done' in request.json:
        abort(400)
    
    tasks = models.Task.query.all()    
    for task in tasks:
        task.done = request.json['done']        
        
    db.session.commit()
    return 201

@app.route('/comments.json', methods=['GET', 'POST'])
def comments_handler():

    with open('comments.json', 'r') as file:
        comments = json.loads(file.read())

    if request.method == 'POST':
        comments.append(request.form.to_dict())

        with open('comments.json', 'w') as file:
            file.write(json.dumps(comments, indent=4, separators=(',', ': ')))

    return Response(json.dumps(comments), mimetype='application/json', headers={'Cache-Control': 'no-cache'})


