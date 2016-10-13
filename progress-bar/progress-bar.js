import classNames from "classnames";
import { propTypes } from "tcomb-react";
import "./progress-bar.styl";

export type ProgressBarPropsType = {
	className?: string,
	percent: number,
	transitionDuration?: number, // milliseconds
}

export default function ProgressBar(props) {
	const className = classNames(ProgressBar.displayName, {
		[props.className]: props.className,
	});
	const transitionDuration = props.transitionDuration ? `${props.transitionDuration / 1000}s` : "0s";
	const style = {
		width: (props.percent >= 100) ? "100%" : `${props.percent}%`,
		transitionDuration,
		WebkitTransitionDuration: transitionDuration,
	};
	return (
		<div className={className}>
			<div className="bar" style={style} />
		</div>
	);
}

ProgressBar.propTypes = propTypes(ProgressBarPropsType, { strict: false });
ProgressBar.displayName = "g-progress-bar";
ProgressBar.defaultProps = {
	percent: 0,
	transitionDuration: 2000,
};
