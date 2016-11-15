import classNames from "classnames";
import { props as p, ReactElement } from "tcomb-react";
import { match } from "toolbelt";
import LabelField from "./label.field";
import TextField from "./text.field";
import CheckboxField from "./checkbox.field";
import RadioField from "./radio.field";
import FileField from "./file.field";
import SelectField from "./select.field";
import "./field.styl";

export type FieldPropsType = {
	type: "text" | "radio" | "date" | "select" | "textarea" | "label" | "checkbox" | "ckeditor" | "file",
	value?: string | Array<string>,
	optionList?: Array<{key: string, value: string}>,
	defaultValue?: string | Array<string>,
	name: string,
	className?: string,
	label?: string,
	disabled?: boolean,
	// a field can be in combination of state: [validated, un-validated] x [edited, unedited]
	validated?: boolean,
	errorMsg?: string | ReactElement,
	// =====================
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
		disabled: false,
		tabIndex: "0",
		multipleChoice: false,
		validateOnMount: false,
		htmlProps: {},
	};

	static errorCheck(props) {
		["select", "radio", "checkbox"].some((type) => {
			if (type === props.type && !props.optionList) {
				throw new Error(`Field type [${type}] require optionList`);
			}
			return false;
		});

		if (((props.value || props.value === "") && (props.defaultValue || props.defaultValue === ""))) {
			throw new Error(`Field name [${props.name}] cannot have value and defaultValue set at the same time`);
		}

		if ((!props.value && props.value !== "") && (!props.defaultValue && props.defaultValue !== "")) {
			if (props.type !== "file")
				throw new Error(`Field name [${props.name}] must have one of value or defaultValue set`);
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
			validated: props.validated,
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
		if (nextProps.validated !== this.state.validated)
			this.setState({
				validated: nextProps.validated,
			});
	}

	componentDidUpdate(prevProps, prevState) {
		// onChange of activeValue
		if (prevState.activeValue !== this.state.activeValue) {
			const formattedValue = this.getValue(prevProps, this.state.activeValue);
			this.props.onChange && this.props.onChange(
				this.props.id,
				this.state.activeValue,
				formattedValue,
				this.state.edited
			);
		}
	}

	getValue() {
		return this.props.formatter ? this.props.formatter(this.state.activeValue) : this.state.activeValue;
	}

	setEditedState(isEdited) {
		this.setState({
			edited: isEdited,
		})
	}

	onChange = (e) => {
		this.setState({
			validated: false,
		})
		const {activeValue} = this.state;
		const newValue = e.target.value;
		const _activeValue = match(this.props.type, {

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
				activeValue: _activeValue,
				edited: true,
			});
		}
	};

	onKeyUp = (e) => {
		this.props.onKeyUp && this.props.onKeyUp(e);
	}

	buildField(props, state) {
		const _className = classNames({
			"g-field": true,
			"is-required": !!props.htmlProps.required,
			"is-disabled": !!props.htmlProps.disabled,
			"is-invalid": state.validated && props.errorMsg,
			"is-edited": state.edited,
			["g-field-"+props.type]: !!props.type,
			[props.className]: !!props.className,
		});
		const newProps = Object.assign({}, props, {
			onChange: this.onChange,
			onKeyUp: this.onKeyUp,
			validated: state.validated,   // ?????
			value: state.activeValue,
			edited: state.edited,
			className: _className,
			errorMsg: state.validated ? props.errorMsg : undefined,
		});

		return match(props.type, {
			"label": ()=> {
				return <LabelField {...newProps} />
			},
			"text": ()=> {
				return <TextField {...newProps} />
			},
			"textarea": ()=> {
				return <TextField {...newProps} textarea />
			},
			"checkbox": ()=> {
				return <CheckboxField {...newProps} />
			},
			"radio": ()=> {
				return <RadioField {...newProps} />
			},
			"select": ()=> {
				return <SelectField {...newProps} />
			},
			"file": ()=> {
				return <FileField {...newProps} />
			},
		}, () => {
			return <LabelField label="[Unsupported field type]" />;
		});
	}

	render() {
		return this.buildField(this.props, this.state);
	}
}
