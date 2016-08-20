var Loading = React.createClass({
	displayName: "Loading",
	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
		page: React.PropTypes.bool,
		loadingImage: React.PropTypes.string,
	},
	getDefaultProps() {
		return {
			title: "Loading.."
		}
	},
	buildComponent(props, state) {
		let _className = cx({
			"b-loading": true,
			[props.className]: props.className,
			"b-loading--page": props.page
		});
		return (
			<div className={_className}>
				<div className="wrapper">
					<img src={props.loadingImage} alt="Preloader"/>
					<p>
						{props.title}
					</p>
				</div>
			</div>
		)
	},
	render() {
		return this.buildComponent(this.props, this.state)
	}
});

module.exports = Loading;
