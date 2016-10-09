import classNames from "classnames";
import { propTypes } from "tcomb-react";

export type FileFieldPropsType = {
	name: string,
	value: string,
	label?: string,
	validated?: boolean,
	edited?: boolean,
	onChange?: Function,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

const clearInput = (e) => {
	e.preventDefault();
	this.props.onChange({
		target: { files: undefined } // Huyen Co gi day???
	});
	this.setState({
		fileInputKey : Date.now()
	})
};

export default function FileField(props) {
	return (
		<label className={props.className}>
			<span className="field-label">
				{props.label}
			</span>
			<input
				type="file"
				onChange={props.onChange}
			/>
			<span className="placeholder" dangerouslySetInnerHTML={{__html: props.placeholder}} />
			<button className="reset" onClick={clearInput}>Reset</button>
		</label>
	);
}

FileField.propTypes = propTypes(FileFieldPropsType, { strict: false });
FileField.displayName = "CheckboxField";
FileField.defaultProps = {
	fileInputKey: Date.now(), // reset field after submitting
	validated: true,
	edited: false,
	htmlProps: {}
};
