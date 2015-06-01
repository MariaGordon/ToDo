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
    tasksUnsorted = models.Task.query.all()    
    # Now sort the data
    # Place the unsorted list in a dictionary
    tasksDictionary = {}
    for task in tasksUnsorted:
        tasksDictionary[task.id] = task
        
    tasksSorted = []
    firstTask = models.Task.query.filter_by(first=True).first()
    nextTaskID = None
    if firstTask != None:
        nextTaskID = firstTask.id
            
    while nextTaskID != None:
        nextTask = tasksDictionary[nextTaskID]
        tasksSorted.append(nextTask.json())
        nextTaskID = nextTask.next        
                    
    print(tasksSorted)      
    return  jsonify({"result" : tasksSorted}) 

# TODO this should be a PUT request
@app.route('/todo/api/v1.0/tasks/create', methods=['PUT'])
def create_task():         
    if not request.json or not 'description' in request.json:
        abort(400)    
    
    lastTask = models.Task.query.filter_by(next=None).first()            
    task = models.Task(description=request.json['description'],
                       first = lastTask==None)    
        
    db.session.add(task)
    db.session.commit()
    
    if lastTask != None:    
        task = models.Task.query.filter_by(description=request.json['description']).first()
        lastTask.next = task.id        
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
    return "1", 201

@app.route('/todo/api/v1.0/tasks/move/<int:move_id>/after/<int:after_id>', methods=['PUT'])
def move_task(move_id, after_id):            
    # Redirect item that previously linked to the task that is moved
    task_to_move = models.Task.query.get(move_id)
    before_task_to_move = models.Task.query.filter_by(next=move_id).first()
    if before_task_to_move != None:
        # The moved task was not the last item in the list
        before_task_to_move.next = task_to_move.next
        
    # Redirect the item that now will link to the task that is moved
    task_to_move.next = after_id
    before_task_after = models.Task.query.filter_by(next=after_id).first()
    if before_task_after == None:
        # We moved the task to the end of the list        
        task_to_move.last = True
        task_after = models.Task.query.filter_by(id=after_id).first()
        task_after.last = False
    else:
        before_task_after.next = move_id
        
    db.session.commit()
    print("Commited!")
    return "1", 201
