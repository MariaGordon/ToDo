var Task = React.createClass({
	handleChange: function() {
    	this.props.value["done"] = (this.props.value["done"] === 0) ? 1 : 0; 
    	this.props.onUpdateTask(this.props.id, this.props.value["done"])
    },    
    render: function() {    
    return (
    		  <div className="task">
              <div className="checkbox">
                  <label>
      	<input type="checkbox" checked={this.props.value["done"]} onChange={this.handleChange}> {this.props.value["description"]}</input>               
      	</label>
        <span className="ui-icon ui-icon-arrowthick-2-n-s"></span>
    </div>
</div>       
    );
  }
});