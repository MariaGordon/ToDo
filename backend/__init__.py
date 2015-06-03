import json
import os
import sys
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

@app.route('/todo/api/v1.0/tasks/move/<int:moveid>/after/<int:afterid>', methods=['PUT'])
def move_task(moveid, afterid):           
    # Redirect item that previously linked to the task that is moved
    movetask = models.Task.query.get(moveid)            
    if movetask.first:
        # The moved task was the first in the list
        movetask.first = False
        new_firsttask = models.Task.query.get(movetask.next)
        new_firsttask.first = True
    else:
        # The moved task was not the first item in the list
        previous_linked_to_movetask = models.Task.query.filter_by(next=movetask.id).first()
        previous_linked_to_movetask.next = movetask.next    
        
    # Redirect the item that now will link to the task that is moved
    if afterid == None:
        # We move the task to the end of the list
        new_linked_to_movetask = models.Task.query.filter_by(next=None).first()
        movetask.next = None
        new_linked_to_movetask.next = moveid        
    else:
        new_linked_to_movetask = models.Task.query.get(afterid)
        movetask.next = new_linked_to_movetask.next
        new_linked_to_movetask.next = moveid
                
    db.session.commit()
    return "1", 201
