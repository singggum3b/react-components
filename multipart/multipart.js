import classNames from "classnames";
import { propTypes } from "tcomb-react";

/**
 * @name Multipart
 * @description A component, which takes multiple components and choose which component need to show
 * @example
 * <Multipart activePart={activePart} partMap={this.buildPartMap(props, state)} />
 */

export type MultipartPropsType = {
	className?: string,
	partMap: {
		[key: string]: Function
	},
	activePart: Array<string>
}

export default function Multipart(props) {
	const cls = classNames(Multipart.displayName, {
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
Multipart.propTypes = propTypes(MultipartPropsType, { strict: false });
Multipart.displayName = "g-multipart";
