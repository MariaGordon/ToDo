var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var TaskList = React.createClass({
	getInitialState: function() {
	    return {data: this.props.data};
	  },
	handleUpdate: function(id, done) {
		this.props.onTaskUpdate(id, done);
    },
    dragStart: function(e) {
    	this.dragged = e.currentTarget;
    	e.dataTransfer.effectAllowed = 'move';
        // Firefox requires calling dataTransfer.setData
        // for the drag to properly work
        e.dataTransfer.setData("text/html", e.currentTarget);
      },
      dragEnd: function(e) {

        this.dragged.style.display = "block";
        this.dragged.parentNode.removeChild(placeholder);
        
        // Tell TaskBox about the move
        var data = this.state.data;        
        var moved = Number(this.dragged.dataset.id);        
        var to = Number(this.over.dataset.id);
        var fromId = 1;
        
        console.log(this.dragged.dataset);
        this.props.onMove(this.props.data[moved], 
        			this.props.data[fromId], 
        			this.props.data[to]);
      },
      dragOver: function(e) {
        e.preventDefault();
        this.dragged.style.display = "none";
        if(e.target.className == "placeholder") return;
        this.over = e.target;        
        e.target.parentNode.insertBefore(placeholder, e.target);
      },
    
  render: function() {

	var taskNodes = []
	i = 0
	for (task in this.props.data) {
		i = i + 1;
		taskNodes.push(
				  <li className="list-group-item"
				  data-id={task}
				  draggable="true"
				  onDragEnd={this.dragEnd}
				  onDragStart={this.dragStart}>
				<Task id={task} value={this.props.data[task]} onUpdateTask={this.handleUpdate}/>
						</li>); 
	};
	
    return (
      <ul onDragOver={this.dragOver}>
        {taskNodes}
      </ul>
    );
  }
});