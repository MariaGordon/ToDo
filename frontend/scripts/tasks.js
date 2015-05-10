
// TODO: Add checkbox and a handleOnSubmit
var Task = React.createClass({
	onChange: function() {
    	this.props.done = (this.props.done === 0) ? 1 : 0;
    	this.props.onUpdateTask(this.props.description, this.props.done)
    },
    render: function() {
    
    return (
      <form className="task">
      	<input type="checkbox" checked={this.props.done} onChange={this.onChange}> {this.props.description}</input>               
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
  handleNewTaskSubmit: function(newTask) {
    var tasks = this.state.data;
    console.log(newTask)
    tasks["task"].push(newTask);
    console.log(tasks["task"])
    this.setState({data: tasks}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        data: JSON.stringify(newTask),
        success: function(data) {
          this.setState({data: tasks});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
    handleUpdateTask: function(description, done) {
        var tasks = this.state.data;
        console.log(newTask)
        tasks["task"].push(newTask);
        console.log(tasks["task"])
        this.setState({data: tasks}, function() {
          // `setState` accepts a callback. To avoid (improbable) race condition,
          // `we'll send the ajax request right after we optimistically set the new
          // `state.
          $.ajax({
            url: this.props.url,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'PUT',
            data: JSON.stringify(newTask),
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
    return {data: {"task" : []}};
  },
  componentDidMount: function() {
    this.loadTasksFromServer();
    setInterval(this.loadTasksFromServer, this.props.pollInterval);
  },
  render: function() {
		console.log("yeah")
		console.log(this.state.data)
    return (
      <div className="taskBox">
        <h1>Todos</h1>
        <TaskList data={this.state.data} onUpdateTask={this.handleUpdateTask}/>
        <TaskForm onNewTaskSubmit={this.handleNewTaskSubmit} />
      </div>
    );
  }
});

var TaskList = React.createClass({
  render: function() {  	  		
    var taskNodes = this.props.data["task"].map(function(task, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Task done={task.done} description={task.description} key={index} onUpdateTask={this.onUpdateTask}>
          {task.description}
        </Task>
      );      
    });
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
    this.props.onNewTaskSubmit({description: description});
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
