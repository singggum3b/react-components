import classNames from "classnames";
import { propTypes, ReactNode } from "tcomb-react";
import "./layer.styl";

export type LayerPropsType = {
	onClick?: Function,
	onScroll?: Function,
	parent?: boolean,
	onWheel?: Function,
	className?: string,
	children?: ReactNode,
	allowTouchMove?: boolean,
}

const onWheel = (props) => (e) => {
	props.onWheel && props.onWheel(e);
};

const onClick = (props) => (e) => {
	if (e.target === e.currentTarget) {
		props.onClick && props.onClick(e);
	}
};

const onTouchMove = (props) => (e) => {
	if (!props.allowTouchMove) {
		e.preventDefault();
		e.stopPropagation();
	}
};

export default function Layer(props) {
	const { parent } = props;
	const cls = classNames(Layer.displayName, {
		"g-layer--parent": !!parent,
		[props.className]: !!props.className,
	});

	return (
		<div
			className={cls}
			onWheel={onWheel(props)}
			onClick={onClick(props)}
			onTouchMove={onTouchMove(props)}>
			{props.children}
		</div>
	);
}

Layer.propTypes = propTypes(LayerPropsType, { strict: false });
Layer.displayName = "g-layer";
Layer.defaultProps = {
	allowTouchMove: false,
}
