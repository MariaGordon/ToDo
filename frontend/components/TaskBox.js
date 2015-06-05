/*
 * Front-end Javascript based on Facebook React.
 * Communicates via AJAX REST API calls to back-end server
 * 
 * TaskBox is the main component connecting frontend to backend
 * TaskForm enable new task creation. 
 * TaskList component holds the complete todo-list.
 *   Task exposes one task item
 * TaskFooter displays items left and enable marking all items
 *    
 * Inspired by the Facebook React tutorial building comments box.
 */

var TaskBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
    
  loadTasksFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {    	
        this.setState({data: data["result"]});
      }.bind(this),
      error: function(xhr, status, err) {    	
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  handleNewTaskSubmit: function(description) {
    var tasks = this.state.data;    
    tasks.push({"id": "temporary",
    			"description": description,
    			"done": false});
    this.setState({data: tasks}, function() {
      $.ajax({
        url: this.props.url+"/create",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        data: JSON.stringify({"description": description}),
        success: function(data) {
          this.setState({data: tasks});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  
  handleUpdateTask: function(index, id, done) {
	  var tasks = this.state.data;
	  tasks[index]["done"] = done;
	  this.setState({data: tasks}, function() {
		  $.ajax({
			  url: this.props.url+"/status",
			  dataType: 'json',
			  contentType: 'application/json; charset=utf-8',
			  type: 'POST',
			  data: JSON.stringify({'id': id,
				                    'done': done}),
			  success: function(data) {
				  this.setState({data: tasks});
			  }.bind(this),
			  error: function(xhr, status, err) {
				  console.error(this.props.url, status, err.toString());
			  }.bind(this)
		  });			
	  	});
  },
  
  handleMove: function(indexMoved, indexTo, idMoved, idTo) {
	  var tasks = this.state.data;
	  tasks.splice(indexTo, 0, tasks.splice(indexMoved, 1)[0]);	  
	  this.setState({data: tasks}, function() {
		  $.ajax({
			  url: this.props.url+"/move",
			  dataType: 'json',
              contentType: 'application/json; charset=utf-8',
			  type: 'POST',
			  data: JSON.stringify({'moveid': idMoved,
                                    'afterid': idTo}),
			  success: function(data) {
				  this.setState({data: tasks});
			  }.bind(this),
			  error: function(xhr, status, err) {
				  console.error(this.props.url, status, err.toString());
			  }.bind(this)
		  });
	  });
  },
    
  handleMarkAll: function() {	
	  var tasks = this.state.data;
	  tasks.forEach(function (task) {
		  task["done"] = true;
		  return task;
	  });	  	  	  	  
	  this.setState({data: tasks}, function() {
		  $.ajax({
			  url: this.props.url+"/complete",			  
              type: 'POST',
			  success: function(data) {				  
				  this.setState({data: tasks});
			  }.bind(this),
			  error: function(xhr, status, err) {				  
				  console.error(this.props.url, status, err.toString());
			  }.bind(this)
		  });
	  });
  },
  
  componentDidMount: function() {
    this.loadTasksFromServer();
    setInterval(this.loadTasksFromServer, this.props.pollInterval);
  },
  
  render: function() {	  
    return (    		
		<div className="taskBox">      
	      <h1>Todos</h1>      
	      <div className="taskForm">
	         <TaskForm onNewTaskSubmit={this.handleNewTaskSubmit}/>
	     </div>
		 <div className="taskList">	 	 	
	        <TaskList data={this.state.data} onTaskUpdate={this.handleUpdateTask} onMove={this.handleMove}/>        
	      </div>
	     <div className="taskFooter">
	       <TaskFooter data={this.state.data} onMarkAll={this.handleMarkAll}/>             
	     </div>
	    </div>     
    );
  }  
});

React.render(
  <TaskBox url="todo/api/v1.0/tasks" pollInterval={2000} />,
  document.getElementById('content')
);
