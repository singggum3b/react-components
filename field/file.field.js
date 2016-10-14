import { propTypes } from "tcomb-react";

export type FileFieldPropsType = {
	name: string,
	label?: string,
	validated?: boolean,
	placeholder?: string,
	edited?: boolean,
	onChange?: Function,
	className?: string,
	htmlProps?: {[key:string] : any}, // HTML Attributes of input tag
}

export default class FileField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileInputKey: Date.now(), // reset field after submitting
		};
	}

	clearInput = () => {
		this.props.onChange({
			target: { files: undefined }, // simulate event
		});

		this.setState({
			fileInputKey: Date.now(),
		});

	};

	buildComponent(props, state) {
		return (
			<label className={props.className}>
				<span className="field-label">
					{props.label}
				</span>
				<input
					key={state.fileInputKey}
					type="file"
					onChange={props.onChange} />
				<span className="placeholder">{props.placeholder}</span>
				<button className="reset" onClick={this.clearInput}>Reset</button>
			</label>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}

FileField.propTypes = propTypes(FileFieldPropsType, { strict: false });
FileField.displayName = "CheckboxField";
FileField.defaultProps = {
	validated: false,
	edited: false,
	htmlProps: {},
};
