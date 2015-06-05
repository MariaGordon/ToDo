# todo-flask-react
A web TODO-list using Flask and Facebook React frameworks

## Backend
Using a SQLite database to store database items. Built with the Python Flask framework. 
Inspired by the excellent Mega-tutorial on Flask by Miguel Grinberg.

## Frontend
Using Facebook React and AJAX calls. Communicates with a JSON-based REST API to backend.
Inspired by the Facebook React tutorial on building comments box.

Inspired by Daniel Stocks on drag of items. 

## Requirements
* Python3 (not tested with python2 but should work)
* Flask
```
  pip install flask
  pip install flask-sqlalchemy
```

## Outstanding items
Drag is bugging a lot on the front-end. The drag sometimes get holds of children of the actual node I wish to drag, would like to solve this in a nice way and not have to loop up to the correct parent. 
