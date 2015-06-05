var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var TaskList = React.createClass({
    getInitialState: function() {		
	    return {data: this.props.data};
	},
	
	handleUpdate: function(index, id, done) {		
		this.props.onTaskUpdate(index, id, done);
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
        var data = this.props.data;        
        var moved = Number(this.dragged.dataset.id);        
        var to = Number(this.over.dataset.id);       
        this.props.onMove(moved, to, data[moved].id, data[to].id);        
    },
      
    dragOver: function(e) {    	
        e.preventDefault();
        this.dragged.style.display = "none";
        if(e.target.className == "placeholder") return;
        this.over = e.target;        
        e.target.parentNode.insertBefore(placeholder, e.target);
    },
    
    render: function() {        	
		var taskNodes = this.props.data.map(function(task, i){	
			return (
				<li className="list-group-item"
			  		data-id={i}					
					draggable="true"
					onDragEnd={this.dragEnd}
		  			onDragStart={this.dragStart}>
					<Task 
					    value={task} 
					    index={i} 
					    onUpdateTask={this.handleUpdate}/>
				</li>
			);
	}.bind(this));
		
    return (
      <ul className="taskList list-group" onDragOver={this.dragOver}>
        {taskNodes}
      </ul>
    );
  }
});