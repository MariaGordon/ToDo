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