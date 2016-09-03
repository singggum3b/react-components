import classNames from "classnames";
import {props as p, ReactChildren} from "tcomb-react";
const Button = require("../button");

export type PopupPropsType = {
	onClose?: Function,
	closeIcon: string,
	closeIconHover: string,
	className?: string,
	isTouchDevice?: boolean,
	children: ReactChildren
}

@p(PopupPropsType,{strict: false})
export default class Popup extends React.Component {

	static displayName = "Popup";

	static defaultProps = {
		isTouchDevice: false,
		closeIcon: require("./close.svg"),
		closeIconHover: require("./close_active.svg"),
	};

	componentDidMount() {
		this.fixBody();
	}

	componentWillUnmount() {
		this.unFixBody();
	}

	onClose = () => {
		this.unFixBody();
		this.props.onClose && this.props.onClose();
	};

	fixBody = () => {
		const html = document.querySelector("html");
		const body = document.querySelector("body");
		Object.assign(html.style, {
			height: "100%",
			overflow: "hidden",
		});

		if (this.props.isTouchDevice) {
			this._lastScrollTop = body.scrollTop;
			setTimeout(function () {
				html.className += " no-scroll";
			},250);
		}
	}

	unFixBody = () => {
		const html = document.querySelector("html");
		const body = document.querySelector("body");
		Object.assign(html.style, {
			height: "",
			overflow: "",
		});
		html.className = html.className.replace(/\bno-scroll\b/,"");
		body.scrollTop = this._lastScrollTop;
	}

	buildComponent() {
		const _className = classNames({
			[this.props.className]: !!this.props.className,
			"b-popup": true,
		});

		return (
			<div className={_className}>
				<Button title="Close" className="close"
								mode="image" icon={this.props.closeIcon}
								iconHover={this.props.closeIconHover} onClick={this.onClose}
				/>
				{this.props.children}
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}

}
