var Task = React.createClass({
	handleChange: function() {
    	this.props.value["done"] = (this.props.value["done"] === 0) ? 1 : 0; 
    	this.props.onUpdateTask(this.props.id, this.props.value["done"])
    },    
    render: function() {    
    return (
      <form className="task">
      	<input type="checkbox" checked={this.props.value["done"]} onChange={this.handleChange}> {this.props.value["description"]}</input>               
      </form>        
    );
  }
});

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
    tasks["temporary"] = {"description" : description, "done" : false};    
    this.setState({data: tasks}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the
		// new
      // `state.
      $.ajax({
        url: this.props.url,
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
  handleUpdateTask: function(id, done) {
	  var tasks = this.state.data;
	  tasks[id]["done"] = done;
	  this.setState({data:tasks}, function() {
		  $.ajax({
			  url: this.props.url+"/"+id,
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
  getInitialState: function() {
    return {data: {}};
  },
  componentDidMount: function() {
    this.loadTasksFromServer();
    setInterval(this.loadTasksFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="taskBox">
        <h1>Todos</h1>
        <TaskList data={this.state.data} onTaskUpdate={this.handleUpdateTask} />
        <TaskForm onNewTaskSubmit={this.handleNewTaskSubmit} />
      </div>
    );
  }
});

var TaskList = React.createClass({
	handleUpdate: function(id, done) {
		this.props.onTaskUpdate(id, done);
    },
  render: function() {  	  			
	var taskNodes = []
	for (task in this.props.data) {			
		taskNodes.push(<Task id={task} value={this.props.data[task]} onUpdateTask={this.handleUpdate}/>); 
	};
    return (
      <div className="taskList">
        {taskNodes}
      </div>
    );
  }
});

var TaskForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      return;
    }
    this.props.onNewTaskSubmit(description);
    React.findDOMNode(this.refs.description).value = '';    
  },
  render: function() {
    return (
      <form className="taskForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="What needs to be done?" ref="description" />        
        <input type="submit" value="Add Todo" />
      </form>
    );
  }
});

React.render(
  <TaskBox url="todo/api/v1.0/tasks" pollInterval={2000} />,
  document.getElementById('content')
);
