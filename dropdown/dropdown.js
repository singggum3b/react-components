import classNames from "classnames";
import { props as p } from "tcomb-react";
import Multipart from "../multipart/multipart";

/**
 * @name Dropdown
 * @description
 * @example
 * <Dropdown buildHead={this.buildHead} buildBody={this.buildBody} expanded={state.expanded} />
 */

export type DropdownPropsType = {
	name?: string,
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.expanded !== this.props.expanded) {
			this.setState({
				expanded: nextProps.expanded,
			});
		}
	}

	expand() {
		this.setState({
			expanded: true,
		});
	}

	collapse() {
		this.setState({
			expanded: false,
		});
	}

	buildHead=() => {
		return (
			<div key="dropdown-head" className="dropdown-head">
				{this.props.buildHead(this)}
			</div>
		);
	};

	buildBody=() => {
		return (
			<div key="dropdown-body" className="dropdown-body">
				{this.props.buildBody(this)}
			</div>
		);
	};

	buildPartMap(props, state) {
		return {
			head: this.buildHead,
			body: this.buildBody,
		};
	}

	buildComponent(props, state) {
		const cls = classNames("g-dropdown", {
			[props.className]: !!props.className,
		});
		const activePart = state.expanded ? ["head", "body"] : ["head"];

		return (
			<Multipart
				className={cls}
				activePart={activePart}
				partMap={this.buildPartMap(props, state)}
			/>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}
