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

export default function Layer(props) {
	const { parent } = props;
	const _className = classNames({
		"g-layer": true,
		"g-layer--parent": !!parent,
		[props.className]: !!props.className
	});

	return (
		<div className={_className} onWheel={onWheel(props)} onClick={onClick(props)}
			 onTouchMove={onTouchMove}>
			{props.children}
		</div>
	);
}

const onWheel = (props) => (e) => {
	props.onWheel && props.onWheel(e);
};

const onClick = (props) => (e) => {
	if (e.target === e.currentTarget) {
		props.onClick && props.onClick(e);
	}
};

function onTouchMove(e) {
	if (!props.allowTouchMove) {
		e.preventDefault();
		e.stopPropagation();
	}
};

Layer.propTypes = propTypes(LayerPropsType, { strict: false });
Layer.displayName = "Layer";
Layer.defaultProps = {
	allowTouchMove: false
}
