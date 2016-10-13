import classNames from "classnames";
import {props as p, ReactChildren} from "tcomb-react";

import Button from "../button/button";

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

	static displayName = "g-popup";

	static defaultProps = {
		isTouchDevice: false,
		closeIcon: require("./close.svg"), // eslint-disable-line global-require
		closeIconHover: require("./close_active.svg"), // eslint-disable-line global-require
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
		const html = window.document.querySelector("html");
		const body = window.document.querySelector("body");
		Object.assign(html.style, {
			height: "100%",
			overflow: "hidden",
		});

		if (this.props.isTouchDevice) {
			this.lastScrollTop = body.scrollTop;
			setTimeout(() => {
				html.className += " no-scroll";
			}, 250);
		}
	}

	unFixBody = () => {
		const html = window.document.querySelector("html");
		const body = window.document.querySelector("body");
		Object.assign(html.style, {
			height: "",
			overflow: "",
		});
		html.className = html.className.replace(/\bno-scroll\b/,"");
		body.scrollTop = this.lastScrollTop;
	}

	buildComponent() {
		const cls = classNames(Popup.displayName, {
			[this.props.className]: !!this.props.className,
		});

		return (
			<div className={cls}>
				<Button
					title="Close"
					className="close"
					mode="image"
					icon={this.props.closeIcon}
					iconHover={this.props.closeIconHover}
					onClick={this.onClose} />
				{this.props.children}
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}

}
