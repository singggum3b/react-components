import { propTypes, ReactElement } from "tcomb-react";
import "./text.field.styl";

export type TextFieldPropsType = {
	type: string,
	name: string,
	value: string,
	label?: string,
	validated?: boolean,
	errorMsg?: string | ReactElement,
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
			value={props.value}
			onChange={props.onChange}
			onKeyUp={props.onKeyUp}
			{...props.htmlProps} />
	) : (
		<textarea
			name={props.name}
			value={props.value}
			onChange={props.onChange}
			onKeyUp={props.onKeyUp}
			{...props.htmlProps} />
	);

	return (
		<label className={props.className}>
			<span className="field-label">{props.label}</span>
			{field}
			<span className="error-message">{props.errorMsg}</span>
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
