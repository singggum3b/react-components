import classNames from "classnames";
import { props as p } from "tcomb-react";
import Multipart from "../multipart/multipart";

export type DropdownPropsType = {
	className?: string,
	expanded: boolean,
	buildHead: Function,
	buildBody: Function,
}

@p(DropdownPropsType, {strict: false})
export default class Dropdown extends React.Component {
	static displayName = "Dropdown";

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {
			expanded: props.expanded,
		};
	}

	expand() {
		this.setState({
			expanded: true,
		});
	}

	colllapse() {
		this.setState({
			expanded: false,
		});
	}

	buildHead=() => {
		return (
			<div key="head" className="head">
				{this.props.buildHead(this)}
			</div>
		);
	};

	buildBody=() => {
		return (
			<div key="body" className="body">
				{this.props.buildBody(this)}
			</div>
		);
	};

	buildPartMap(props,state) {
		return {
			head: this.buildHead,
			body: this.buildBody,
		};
	}

	buildComponent(props,state) {
		const cls = classNames("g-dropdown", {
			[props.className]: !!props.className,
		});
		const activePart = state.expanded ? ["head","body"] : ["head"];

		return (
			<Multipart className={cls}
								 activePart={activePart}
								 partMap={this.buildPartMap(props,state)} />
		);
	}

	render() {
		return this.buildComponent(this.props,this.state);
	}
}
