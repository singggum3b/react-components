import classNames from "classnames";
import {props as p} from "tcomb-react";
import "./backtop.styl";

export type BackTopPropsType = {
	className?: string,
	icon?: string,
	scrollDuration?: number,
}

@p(BackTopPropsType, {strict: false})
export default class Backtop extends React.Component {
	static displayName = "g-backtop";

	static defaultProps = {
		scrollDuration: 1000,
		icon: require("./backtop.svg"), // eslint-disable-line global-require
	};

	constructor() {
		super();
		this.state = {
			isShow: !!window.document.body.scrollTop,
		};
	}

	componentDidMount() {
		this.onScroll();
		window.addEventListener("scroll", this.onScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.onScroll);
	}

	onScroll = () => {
		const scrollTop = window.document.body.scrollTop;
		if (scrollTop && !this.state.isShow) {
			this.setState({
				isShow: true,
			});
		} else if (!scrollTop && this.state.isShow) {
			this.setState({
				isShow: false,
			});
		}
	}

	backToTop = () => {
		window.requestAnimationFrame(step(this.props.scrollDuration));
	};

	buildComponent = (props) => {
		const cls = classNames(Backtop.displayName, {
			showing: this.state.isShow,
			[props.className]: !!props.className,
		});

		return (
			<div className={cls} onClick={this.backToTop}>
				<img src={props.icon} alt="Back to top" />
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props);
	}
}

/**
 * @description: change the speed of backTop button
 * Reference: http://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
 */
export function step(scrollDuration) {
	const instance = {};
	const cosParameter = window.scrollY / 2;

	return function _step(newTimestamp) {
		instance.scrollCount = instance.scrollCount || 0;
		instance.oldTimestamp = instance.oldTimestamp || window.performance.now();
		instance.scrollCount += Math.PI / (scrollDuration / (newTimestamp - instance.oldTimestamp));
		if (instance.scrollCount >= Math.PI) window.scrollTo(0, 0);
		if (window.scrollY === 0) return;
		window.scrollTo(0, Math.round(cosParameter + (cosParameter * Math.cos(instance.scrollCount))));
		instance.oldTimestamp = newTimestamp;
		window.requestAnimationFrame(_step);
	};
}
