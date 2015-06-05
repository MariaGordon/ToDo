var TaskFooter = React.createClass({	
	handleMarkAll: function() {
		this.props.onMarkAll();    	
    },    
    
    itemsNotDone: function () {    	
        return this.props.data.filter(function (task){    		
            return task["done"] === false;
    	})        
    },
    
    render: function() {           	
    var itemsLeft = this.itemsNotDone().length;    
    return (
	  <div className="taskFooter">
	  	<span className="counter">{itemsLeft} items left</span>
	  	<span className="markAll" onClick={this.handleMarkAll}>
	  	  Mark all as complete
	  	</span>	      
      </div>       
    );
  }
});