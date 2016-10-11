import { propTypes } from "tcomb-react";

export type LabelFieldPropsType = {
	label: string,
	htmlFor: string,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

export default function LabelField(props) {
	return (
		<label className={props.className} {...props.htmlProps} htmlFor={props.htmlFor}>
			{props.label}
		</label>
	);
}

LabelField.propTypes = propTypes(LabelFieldPropsType, { strict: false });
LabelField.displayName = "LabelField";
LabelField.defaultProps = {
	htmlProps: {},
};
