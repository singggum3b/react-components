import classNames from "classnames";
import {props as p} from "tcomb-react";
import "./backtop.styl"

export type BackTopPropsType = {
	className?: string,
	icon?: string,
	scrollDuration?: number,
}

@p(BackTopPropsType, {strict: false})
export default class Backtop extends React.Component {
	static displayName = "Backtop";

	static defaultProps = {
		scrollDuration: 1000,
		icon: require("./backtop.svg"),
	};

	constructor() {
		super();
		this.state = {
			isShow: document.body.scrollTop ? true : false
		}
	}

	componentDidMount() {
		this.onScroll();
		window.addEventListener('scroll', this.onScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onScroll = () => {
		const scrollTop = document.body.scrollTop;
		if (scrollTop && !this.state.isShow) {
			this.setState({
				isShow: true
			})
		} else if (!scrollTop && this.state.isShow) {
			this.setState({
				isShow: false
			})
		}
	}

	backToTop = () => {
		window.requestAnimationFrame(step(this.props.scrollDuration));
	};

	buildComponent = (props) => {
		const _className = classNames({
			"g-backtop": true,
			"showing": this.state.isShow,
			[props.className]: !!props.className
		});

		return (
			<div className={_className} onClick={this.backToTop}>
				<img src={props.icon} alt="Back to top"/>
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props);
	}
}

// http://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
export function step(scrollDuration) {
	const _this = {};
	const cosParameter = window.scrollY / 2;

	return function _step(newTimestamp) {
		_this.scrollCount = _this.scrollCount || 0;
		_this.oldTimestamp = _this.oldTimestamp || performance.now();
		_this.scrollCount += Math.PI / (scrollDuration / (newTimestamp - _this.oldTimestamp));
		if (_this.scrollCount >= Math.PI) window.scrollTo(0, 0);
		if (window.scrollY === 0) return;
		window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(_this.scrollCount)));
		_this.oldTimestamp = newTimestamp;
		window.requestAnimationFrame(_step);
	}
}
