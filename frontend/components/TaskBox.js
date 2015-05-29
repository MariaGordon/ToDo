/*
 * Front-end Javascript based on Facebook react.
 * Communicates via AJAX REST API calls to back-end server
 * 
 * TaskBox is the main component connecting frontend to backend
 * TaskForm enable new task creation. 
 * TaskList component holds the complete todo-list.
 *   Task exposes one task item
 *    
 * Inspired by the Facebook React tutorial building comments box.
 */


var TaskBox = React.createClass({
  loadTasksFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {    	
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleNewTaskSubmit: function(description) {
    var tasks = this.state.data;
    console.log(description)
    tasks["temporary"] = {"description" : description, "done" : false};    
    this.setState({data: tasks}, function() {
      $.ajax({
        url: this.props.url+"/create",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'PUT',
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
  handleUpdateTask: function(id, done) {
	  var tasks = this.state.data;
	  tasks[id]["done"] = done;
	  this.setState({data:tasks}, function() {
		  $.ajax({
			  url: this.props.url+"/status/"+id,
			  dataType: 'json',
			  contentType: 'application/json; charset=utf-8',
			  type: 'PUT',
			  data: JSON.stringify({'done': done}),
			  success: function(data) {
				  this.setState({data: tasks});
			  }.bind(this),
			  error: function(xhr, status, err) {
				  console.error(this.props.url, status, err.toString());
			  }.bind(this)
		  });			
	  	});
  },
  handleMove: function(idMoved, toId) {
	  // TODO: Temporary client move
	  console.log("idMoved")
	  console.log(idMoved)
	  $.ajax({
		  url: this.props.url+"/move/"+idMoved,
		  dataType: 'json',
		  contentType: 'application/json',
		  type: 'PUT',
		  data: JSON.stringify({'after': toId}),
		  success: function() {
			  console.log("Success, moved")
		  },
		  error: function(xhr, status, err) {
			  console.error(this.props.url, status, err.toString());
		  }.bind(this)
	  });
	  console.log("Move item:");
	  console.log(idMoved);
	  console.log("To after element:");
	  console.log(toId);	  
  },
  getInitialState: function() {
    return {data: {}};
  },
  componentDidMount: function() {
    this.loadTasksFromServer();
    setInterval(this.loadTasksFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
    		
	<div className="taskBox panel panel-default">
      <div className="title text-center">
         <h3><strong>Todos</strong></h3>
      </div>

      <div className="taskForm">
         <TaskForm onNewTaskSubmit={this.handleNewTaskSubmit}/>
     </div>
	 <div className="taskList">	 
        <TaskList data={this.state.data} onTaskUpdate={this.handleUpdateTask} onMove={this.handleMove}/>        
      </div>
        </div>
    );
  }
});



React.render(
  <TaskBox url="todo/api/v1.0/tasks" pollInterval={2000} />,
  document.getElementById('content')
);