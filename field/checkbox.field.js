import { propTypes } from "tcomb-react";

export type CheckboxFieldPropsType = {
	name: string,
	value: [{[key:string] : any}],
	label?: string,
	validated?: boolean,
	edited?: boolean,
	onChange?: Function,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

const renderField = (props) => {
	return props.value.map((item) => {
		const newHtmlProps = Object.assign({}, props.htmlProps, item.htmlProps);
		return (
			<label className="checkbox-item" key={item.value}>
				<input
					type="checkbox"
					name={item.name}
					value={item.value}
					onChange={props.onChange}
					checked={props.activeValue === item.value}
					{...newHtmlProps}
				/>
				<span className="item-label">
					{item.label}
				</span>
			</label>
		);
	})
};

export default function CheckboxField(props) {
	return (
		<div className={props.className}>
			<span className="npm field-label">
				{props.label}
			</span>
			{renderField(props)}
		</div>
	);
}

CheckboxField.propsType = propTypes(CheckboxFieldPropsType, { strict: false });
CheckboxField.displayName = "CheckboxField";
CheckboxField.defaultProps = {
	validated: true,
	edited: false,
	htmlProps: {}
};
