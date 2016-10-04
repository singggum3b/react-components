import classNames from "classnames";
import { props as p } from "tcomb-react";
import { match } from "toolbelt";
import LabelField from "./label.field";
import TextField from "./text.field";
import CheckboxField from "./checkbox.field";
import RadioField from "./radio.field";
import FileField from "./file.field";

export type FieldPropsType = {
	type: "text" | "radio" | "date" | "select" | "textarea" | "label" | "checkbox" | "ckeditor" | "file",
	value: string | Array<{[key:string] : any}>,
	defaultValue?: string | Array<{[key:string] : any}>,
	name?: string,
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
	//***
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
	}

	constructor(props) {
		super(props);
		this.state = {
			// if props.value is array
			activeValue: (this.props.value && Array.isArray(this.props.value)) ? this.props.defaultValue : this.props.value,
			// validated: !(this.props.validation && (this.props.validation.size > 0)) || (!this.props.required && !(this.props.value && this.props.value.length)),
			edited: false,
		}
	}

	componentWillMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	validate(props, state) {

	}

	onChange = (e) => {
		const _activeValue = match(e.target.type, {
			"checkbox": ()=> {
				return !e.target.checked ? Object.assign({}, this.state.activeValue, {[e.target.value]: false}) :
					this.state.activeValue ?
					Object.assign({}, this.state.activeValue, {[e.target.value]: true})
					:
					{[e.target.value]: true}
			},
			"file": ()=> {
				return e.target.files;
			},
		}, ()=> {
			return e.target.value;
		});
		this.setState({
			activeValue: _activeValue,
		})
	}

	onKeyUp = (e) => {
		this.props.onKeyUp && this.props.onKeyUp(e);
	}

	buildField(props, state) {
		const _className = classNames({
			"g-field": true,
			"is-required": !!props.htmlProps.required,
			"is-disabled": !!props.htmlProps.disabled,
			"is-invalid": !props.validated,
			"is-edited": props.edited,
			["g-field-"+props.type]: !!props.type,
			[props.className]: !!props.className
		});
		const newProps = Object.assign({}, props, {
			onChange: this.onChange,
			onKeyUp: this.onKeyUp,
			validated: state.validated,   // ?????
			activeValue: state.activeValue,
			edited: state.edited,
			className: _className,
		});
		return match(props.type, {
			"label": ()=> {
				return <LabelField {...newProps} ></LabelField>
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
			"file": ()=> {
				return <FileField {...newProps} ></FileField>
			},
		}, () => {
			return null //<Field.Label title="[Unsuppoted field type]" ></Field.Label>
		});
	}

	render() {
		return this.buildField(this.props, this.state);
	}
}
