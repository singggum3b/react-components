import { propTypes } from "tcomb-react";

export type TextFieldPropsType = {
	type: string,
	name: string,
	activeValue?: string,
	label?: string,
	validated?: boolean,
	edited?: boolean,
	textarea?: boolean,
	onKeyUp?: Function,
	onChange?: Function,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

export default function TextField(props) {
	const field = !props.textarea ? (
		<input
			type={props.htmlProps.type ? props.htmlProps.type : "text"}
			name={props.name}
			value={props.activeValue}
			onChange={props.onChange}
			onKeyUp={props.onKeyUp}
			{...props.htmlProps} />
	) : (
		<textarea
			name={props.name}
			value={props.activeValue}
			onChange={props.onChange}
			onKeyUp={props.onKeyUp}
			{...props.htmlProps} />
	);

	return (
		<label className={props.className}>
			{props.label}
			{field}
		</label>
	);
}

TextField.propTypes = propTypes(TextFieldPropsType, { strict: false });
TextField.displayName = "TextField";
TextField.defaultProps = {
	activeValue: "",
	validated: true,
	edited: false,
	textarea: false,
	htmlProps: {},
};
