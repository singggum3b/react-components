import classNames from "classnames";
import { props as p, t } from "tcomb-react";

export type MultistatePropsType = {
	className?: string,
	stateMap: {
		[key: string]: Function
	},
	activeState: Array<string>
}

@p(MultistatePropsType, {strict: false})
export default class Multistate extends React.Component {
	static displayName = "Multistate";

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {}
	}

	componentWillReceiveProps(nextProps) {
	}

	buildComponent(props) {
		const cls = classNames("g-multistate", {
			[props.className]: !!props.className
		});

		return (
			<div className={cls}>
				{
					props.activeState.map((key) => (props.stateMap[key]()))
				}
			</div>
		)
	}

	render() {
		return this.buildComponent(this.props);
	}
}
