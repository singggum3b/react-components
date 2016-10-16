import { propTypes, ReactElement } from "tcomb-react";

export type CheckboxFieldPropsType = {
	name: string,
	value: Array<string>,
	optionList: Array<{key: string, value: string}>,
	errorMsg?: string | ReactElement,
	label?: string,
	validated?: boolean,
	edited?: boolean,
	onChange?: Function,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

const renderField = (props) => {
	return props.optionList.map((item) => {
		const newHtmlProps = Object.assign({}, props.htmlProps, item.htmlProps);
		// TODO: review checked
		return (
			<label className="checkbox-item" key={item.value}>
				<input
					type="checkbox"
					name={item.name}
					value={item.value}
					onChange={props.onChange}
					checked={props.value.includes(item.value)}
					{...newHtmlProps} />
				<span className="field-item-label">
					{item.label}
				</span>
			</label>
		);
	});
};

export default function CheckboxField(props) {
	return (
		<div className={props.className}>
			<span className="field-label">
				{props.label}
			</span>
			{renderField(props)}
			<span className="error-message">
				{props.errorMsg}
			</span>
		</div>
	);
}

CheckboxField.propTypes = propTypes(CheckboxFieldPropsType, { strict: false });
CheckboxField.displayName = "CheckboxField";
CheckboxField.defaultProps = {
	validated: true,
	edited: false,
	activeValue: [],
	htmlProps: {},
};
