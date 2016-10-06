import classNames from "classnames";
import { props as p } from "tcomb-react";

export type MultipartPropsType = {
	className?: string,
	partMap: {
		[key: string]: Function
	},
	activePart: Array<string>
}

@p(MultipartPropsType, {strict: false})
export default class Multipart extends React.Component {
	static displayName = "Multipart";

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {};
	}

	buildComponent(props) {
		const cls = classNames("g-multipart", {
			[props.className]: !!props.className,
		});

		return (
			<div className={cls}>
				{
					props.activePart.map((key) => (props.partMap[key]()))
				}
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props);
	}
}
