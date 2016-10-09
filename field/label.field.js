import { propTypes } from "tcomb-react";

export type LabelFieldPropsType = {
	label: string,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

export default function LabelField(props) {
	return (
		<label className={props.className} {...htmlProps}>
			{props.label}
		</label>
	);
}

LabelField.propTypes = propTypes(LabelFieldPropsType, { strict: false });
LabelField.displayName = "LabelField";
LabelField.defaultProps = {
	htmlProps: {},
};
