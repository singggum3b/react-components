var Device = React.createClass({
	displayName: "Device",
	propTypes: {
		getPassDownProps: React.PropTypes.func,
		onUpdated: React.PropTypes.func,
		className: React.PropTypes.string,
		style: React.PropTypes.string,
		device: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string,
			breakpoint: React.PropTypes.number
		}))
	},
	getDataBindings() {
		return {
			width: Media.getters.width
		}
	},
	getDefaultProps() {
		return {
			getPassDownProps: ()=>null,
			onUpdated: ()=> null
		}
	},
	childContextTypes: {
		device : React.PropTypes.oneOf(DEVICE)
	},
	getChildContext() {
		return {
			device: this.getDevice(this.props.device).name
		};
	},
	componentWillMount() {
		try {
			$(window).trigger('resize');
			this.updateDevice();
		} catch (e) {
			console.warn(e);
		}
	},
	componentDidMount() {
		try {
			$(window).trigger('resize');
			this.props.onUpdated && this.props.onUpdated(this.state.width);
		} catch (e) {
			console.warn(e);
		}
	},
	componentDidUpdate() {
		this.updateDevice();
		this.props.onUpdated && this.props.onUpdated(this.state.width);
	},
	getDevice(device) {
		try {
			return device.find((val, index)=> {
				return $(window).width() < val.breakpoint;
			})
		} catch (e) {
			return device[0]
		}
	},
	updateDevice() {
		var html = $("html");

		//Clear classes
		html.removeClass(this.props.device.map(function (val, index) {
			return val.name;
		}).join(" "));


		//Map & apply classes
		[this.getDevice(this.props.device)].map(function (val, index) {
			if (val) {
				html.addClass(val.name);
				//Update mediastore
				Media.actions.updateDevice(val ? val.name : this.props.device[0].name);
			}
		});

	},
	buildChildren(props, state) {
		//console.log(this.state.width && this.getDevice(this.props.device).name);
		return React.Children.map(props.children, (child, index) => {
			return React.cloneElement(child, Object.assign({}, props.getPassDownProps(), {device: this.state.width && this.getDevice(this.props.device).name}))
		});
	},
	render() {
		return (
			<div className={this.props.className} style={this.props.style}>
				{this.buildChildren(this.props, this.state)}
			</div>
		);
	}
});

module.exports = Device;
