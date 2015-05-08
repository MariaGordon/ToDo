/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// TODO: Add checkbox and a handleOnSubmit
var Task = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="task">
        <h2 className="state">
          {this.props.done}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
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
          this.setState({data: data});
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
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
		console.log("yeah")
		console.log(this.state.data)
    return (
      <div className="commentBox">
        <h1>Todos</h1>
        <TaskList data={this.state.data} />
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
        <Task done={task.done} key={index}>
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
  <CommentBox url="todo/api/v1.0/tasks" pollInterval={2000} />,
  document.getElementById('content')
);
