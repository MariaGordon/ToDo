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

# TODO this should be a PUT request
@app.route('/todo/api/v1.0/tasks/create', methods=['PUT'])
def create_task():         
    if not request.json or not 'description' in request.json:
        abort(400)    
    
    lastItem = models.Task.query.filter_by(previous=None).first()
            
    task = models.Task(description=request.json['description'], done=False, previous=None)    
    db.session.add(task)
    db.session.commit()
    
    # Update the previous item to point to the new task instead
    if lastItem != None:
        newItem =  models.Task.query.filter_by(description=request.json['description']).first()
        lastItem.previous = newItem.id
        db.session.commit()
    
    return "1", 201
    
@app.route('/todo/api/v1.0/tasks/status/<int:task_id>', methods=['PUT'])
def update_task(task_id):      
    if not request.json:
        abort(400)    
    if not 'done' in request.json:
        abort(400)
    
    task = models.Task.query.get(task_id)
    task.done = request.json['done']
    db.session.commit()
    return 201

@app.route('/todo/api/v1.0/tasks/move/<int:task_id>', methods=['PUT'])
def move_task(task_id):      
    if not request.json:
        abort(400)    
    if not 'after' in request.json:
        abort(400)
    
    # Redirect item that previously linked to the task that is moved
    taskToMove = models.Task.query.get(task_id)
    previousLinkedTask = models.Task.query.filter_by(previous=task_id).first()    
    if previousLinkedTask != None:
        previousLinkedTask.previous = taskToMove.previous

    # Redirect the item that now will link to the task that is moved    
    taskToMove.previous = request.json['after']
    nextLinkedTask = models.Task.query.filter_by(previous=request.json['after']).first()
    nextLinkedTask.previous = taskToMove.id    
        
    db.session.commit()
    return 201