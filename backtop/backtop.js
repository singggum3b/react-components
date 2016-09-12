import classNames from "classnames";
import {props as p} from "tcomb-react";
import "./backtop.styl"

export type PopupPropsType = {
	className?: string,
	icon?: string,
	scrollDuration?: number,
}

@p(PopupPropsType, {strict: false})
export default class Backtop extends React.Component {
	static displayName = "Backtop";

	static defaultProps = {
		scrollDuration: 1000,
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
		// http://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery

		const scrollDuration = this.props.scrollDuration;
		let cosParameter = window.scrollY / 2,
			scrollCount = 0,
			oldTimestamp = performance.now();
		function step (newTimestamp) {
			scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
			if (scrollCount >= Math.PI) window.scrollTo(0, 0);
			if (window.scrollY === 0) return;
			window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
			oldTimestamp = newTimestamp;
			window.requestAnimationFrame(step);
		}
		window.requestAnimationFrame(step);
	}

	buildComponent = () => {
		const _className = classNames({
			"g-backtop": true,
			[this.props.className]: !!this.props.className
		});

		return this.state.isShow ? (
			<div className={_className} onClick={this.backToTop}>
				<img src={this.props.icon} alt="Back to top" />
			</div>
		) : null
	}

	render() {
		return this.buildComponent();
	}
}
