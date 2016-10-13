import classNames from "classnames";
import { props as p } from "tcomb-react";
import { match } from "toolbelt";
import LabelField from "./label.field";
import TextField from "./text.field";
import CheckboxField from "./checkbox.field";
import RadioField from "./radio.field";
import FileField from "./file.field";
import SelectField from "./select.field";

export type FieldPropsType = {
	type: "text" | "radio" | "date" | "select" | "textarea" | "label" | "checkbox" | "ckeditor" | "file",
	value?: string | Array<string>,
	optionList?: Array<{key: string, value: string}>,
	defaultValue?: string | Array<string>,
	name: string,
	className?: string,
	label?: string,
	validation?: {[key:string]: any},
	required?: boolean,
	disabled?: boolean,
	multipleChoice?: boolean,
	validateOnMount?: boolean,
	onChange?: Function,
	onKeyUp?: Function,
	// Using to store all HTML Attributes of input tag
	// http://www.w3schools.com/tags/tag_input.asp
	htmlProps?: {[key:string] : any},
	// ***
	formatter?: Function,
	validator?: {[key:string]: any}
}

@p(FieldPropsType, {strict: false})
export default class Field extends React.Component {
	static displayName = "Field";

	static defaultProps = {
		required: false,
		disabled: false,
		tabIndex: "0",
		multipleChoice: false,
		validateOnMount: false,
		htmlProps: {},
	};

	static errorCheck(props) {
		[].some((type) => {
			if (type === props.type && !props.optionList) {
				throw new Error(`Field type [${type}] require optionList`);
			}
			return false;
		});

		if (((props.value || props.value === "") && (props.defaultValue || props.defaultValue === ""))) {
			throw new Error(`Field name [${props.name}] cannot have value and defaultValue set at the same time`);
		}

		if ((!props.value && props.value !== "") && (!props.defaultValue && props.defaultValue !== "")) {
			if (props.type !== "file") {
				throw new Error(`Field name [${props.name}] must have one of value or defaultValue set`);
			}
		}
	}

	constructor(props) {
		super(props);
		Field.errorCheck(props);
		this.state = {
			// if props.value is array
			activeValue: props.defaultValue || props.value || "",
			edited: false,
			isControlled: props.value || typeof props.value === "string",
		};

		if (this.state.isControlled) {
			console.info(`Field name [${props.name}] in controlled mode`);
		} else {
			console.info(`Field name [${props.name}] in uncontrolled mode`);
		}
	}

	componentWillMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	componentDidUpdate(prevProps, prevState) {
		// onChange of activeValue
		if (prevState.activeValue !== this.state.activeValue) {
			const formattedValue = this.getValue(prevProps, this.state.activeValue);
			this.props.onChange && this.props.onChange(
				this.props.id,
				this.state.activeValue,
				formattedValue,
				this.state.validated,
				this.state.edited
			);
		}
	}

	onChange = (e) => {
		const { activeValue } = this.state;
		const newValue = e.target.value;
		const newActiveValue = match(this.props.type, {
			checkbox: () => {
				if (e.target.checked) {
					if (activeValue.includes(newValue)) return activeValue;
					return activeValue.concat([newValue]);
				}
				return activeValue.filter((val) => val !== newValue);
			},

			select: () => {
				if (this.props.multiple) {

					if (e.target.checked) {
						if (activeValue.includes(newValue)) return activeValue;
						return activeValue.concat([newValue]);
					}
					return activeValue.filter((val) => val !== newValue);
				}
				return e.target.value;
			},

			file: () => {
				return e.target.files;
			},
		}, () => {
			return e.target.value;
		});

		if (!this.state.isControlled) {
			this.setState({
				activeValue: newActiveValue,
			});
		}
	};

	onKeyUp = (e) => {
		this.props.onKeyUp && this.props.onKeyUp(e);
	}

	getValue(props, activeValue) {
		return props.formatter ? props.formatter(activeValue) : activeValue;
	}

	validate(props, state) {

	}

	buildField(props, state) {
		const cls = classNames({
			"g-field": true,
			"is-required": !!props.htmlProps.required,
			"is-disabled": !!props.htmlProps.disabled,
			"is-invalid": !props.validated,
			"is-edited": props.edited,
			[`g-field-${props.type}`]: !!props.type,
			[props.className]: !!props.className,
		});
		const newProps = Object.assign({}, props, {
			onChange: this.onChange,
			onKeyUp: this.onKeyUp,
			validated: state.validated,   // ?????
			value: state.activeValue,
			edited: state.edited,
			className: cls,
		});

		return match(props.type, {
			label: () => {
				return <LabelField {...newProps} />;
			},
			text: () => {
				return <TextField {...newProps} />;
			},
			textarea: () => {
				return <TextField {...newProps} textarea />;
			},
			checkbox: () => {
				return <CheckboxField {...newProps} />;
			},
			radio: () => {
				return <RadioField {...newProps} />;
			},
			select: () => {
				return <SelectField {...newProps} />;
			},
			file: () => {
				return <FileField {...newProps} />;
			},
		}, () => {
			return <LabelField label="[Unsupported field type]" />;
		});
	}

	render() {
		return this.buildField(this.props, this.state);
	}
}
