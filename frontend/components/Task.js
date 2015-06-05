var Task = React.createClass({
	handleChange: function() {
    	this.props.value["done"] = (this.props.value["done"] === 0) ? 1 : 0;    	
    	this.props.onUpdateTask(this.props.index, this.props.value["id"], this.props.value["done"])
    },    
    
    render: function() {            	
    return (
	  <div className="task">	      
	      <label>
	      	<input 
	      	  type="checkbox" 
	      	  checked={this.props.value["done"]} 
	      	  onChange={this.handleChange} />
	      	<div className={this.props.value["done"]?"checked":"unchecked"}> 
	      	  {this.props.value["description"]}
	      	</div>               
	      </label>	          	     
      </div>       
    );
  }
});