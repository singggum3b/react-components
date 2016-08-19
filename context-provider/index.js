

class ContextProvider extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	static propTypes = {
		children: React.PropTypes.element.isRequired,
		renderAs: React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.func])
	};

	render() {
		const props = this.props;
		return props.renderAs ? (
			React.createElement(props.renderAs,Object.assign({},this.props,{renderAs: undefined}))
		) : React.Children.only(this.props.children)
	}

}

module.exports = function(context) {
	return class extends ContextProvider {
		constructor(props, ctx) {
			super(props, ctx);
		}

		static childContextTypes = Reflect.ownKeys(context).reduce((prevValue,value,index)=>{
			return Object.assign({},prevValue,{[value]: React.PropTypes.any});
		},{});

		getChildContext() {
			return {...context}
		}

	}
};
