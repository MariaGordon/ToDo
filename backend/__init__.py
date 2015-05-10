import json
import os
from flask import Flask, Response, request, jsonify, abort, url_for
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='', static_folder='../frontend')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'todo.db')
db = SQLAlchemy(app)

from backend import models

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():    
    task_list = models.Task.query.all()    
    tasks = {}
    for task in task_list:        
        tasks.update(task.json())        
                   
    return  jsonify(tasks), 200 

@app.route('/todo/api/v1.0/tasks', methods=['POST'])
def create_task():    
    if not request.json or not 'description' in request.json:
        abort(400)    
    
    task = models.Task(description=request.json['description'], done=False)
    db.session.add(task)
    db.session.commit()
    return 201
    
@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):      
    if not request.json:
        abort(400)    
    if not 'done' in request.json:
        abort(400)
    
    task = models.Task.query.get(task_id)
    task.done = request.json['done']
    db.session.commit()
    return 201
