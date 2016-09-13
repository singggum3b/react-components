import classNames from "classnames";
import { propTypes } from "tcomb-react";
import "./progress.styl";

export type ProgressBarPropsType = {
	className?: string,
	percent: number,
	transitionDuration?: number, // milliseconds
}

export default function ProgressBar(props) {
	let className = classNames({
		"g-progress-bar": true,
		[props.className]: props.className
	});
	let transitionDuration = props.transitionDuration ? props.transitionDuration / 1000 + "s" : 0 + "s";
	let style = {
		"width": props.percent + "%",
		"transitionDuration": transitionDuration,
		"WebkitTransitionDuration": transitionDuration
	};
	return (
		<div className={className}>
			<div className="bar" style={style}></div>
		</div>
	);
}

ProgressBar.propsType = propTypes(ProgressBarPropsType, { strict: false });
ProgressBar.displayName = "ProgressBar";
ProgressBar.defaultProps = {
	percent: "70",
	transitionDuration: "2000",
};
