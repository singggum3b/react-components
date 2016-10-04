import classNames from "classnames";
import { propTypes } from "tcomb-react";

export type SelectFieldPropsType = {
	name: string,
	label?: string,
	required?: boolean,
	disabled?: boolean,
	validated?: boolean,
	edited?: boolean,
	textarea?: boolean, // is this textarea tag?
	activeValue: string, // TODO: array?
	onKeyUp?: Function,
	onChange?: Function,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

export default function SelectField(props) {
	const _className = classNames({
		"g-field": true,
		"g-field-text": !props.textarea,
		"g-field-textarea": props.textarea,
		"is-required": !!props.required,
		"is-disabled": !!props.disabled, // what if users want to disable ???
		"is-invalid": !props.validated,
		"is-edited": props.edited,
		[props.className]: props.className
	});

	const content = !props.textarea ? (
		<input
			{...props.htmlProps}
			onKeyUp={props.onKeyUp}
			name={props.name}
			required={props.required}
			value={props.activeValue || ""} // if activeValue is not string?
			onChange={props.onChange}
		   	type="text"//{props.htmlProps.type}
		/>
	) : (
		<textarea
			{...props.htmlProps}
			onKeyUp={props.onKeyUp}
			name={props.name}
		  	required={props.required}
			value={props.activeValue || ""}
		  	onChange={props.onChange}
		/>
	);

	return (
		<label className={_className}>
			{props.label}
			{content}
		</label>
	);
}

SelectField.propsType = propTypes(SelectFieldPropsType, { strict: false });
SelectField.displayName = "TextField";
SelectField.defaultProps = {
	required: false,
	disabled: false,
	validated: false,
	edited: false,
	textarea: false,
	htmlProps: {
		type: "text",
	}
};
