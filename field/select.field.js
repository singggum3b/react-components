import classNames from "classnames";
import { props as p } from "tcomb-react";
import DropdownList from "../dropdown-list/dropdown-list";
import List from "../list/list";
import "./select.field.styl";

export type SelectFieldPropsType = {
	name?: string,
	label?: string,
	validated?: boolean,
	edited?: boolean,
	onChange?: Function,
	className?: string,
	optionList: Array<{key: string, value: string}>,
	multiple: boolean,
	value: string | Array<string>,
}
@p(SelectFieldPropsType, {strict: false})
export default class SelectField extends React.Component {
	static displayName = "SelectField";

	static defaultProps = {
		validated: true,
		edited: false,
		multiple: false,
	};

	static errorCheck(props) {
		if (props.multiple && !Array.isArray(props.value)) {
			throw new Error("Multiples select should have array of value");
		}
		if (!props.multiple && !(typeof props.value === "string")) {
			throw new Error("Single select should have string as value");
		}
	}

	constructor(props) {
		super(props);
		SelectField.errorCheck(props);
		this.state = {
			selected: !!props.selected,
			hovering: false,
		};
	}

	onChange = (e) => {
		// TODO: if disabled => e.preventDefault()
		this.props.onChange && this.props.onChange(e);
	};

	onMouseEnter = () => {
		!this.props.disabled && this.setState({ hovering: true });
	};

	onMouseLeave = () => {
		!this.props.disabled && this.setState({ hovering: false });
	};

	onClickSingleSelectItem = (itemProps, activeKey) => {

	};

	buildItem = (itemProps) => {
		const cls = classNames("field-item", {
			[itemProps.className]: !!itemProps.className,
			selected: this.props.value.includes(itemProps.value),
			hovering: this.state.hovering,
		});

		return (
			<label
				className={cls}
				key={itemProps.value}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave} >
				<input
					name={this.props.name}
					checked={this.props.value.includes(itemProps.value)}
					type="checkbox"
					value={itemProps.key}
					onChange={this.onChange}
					className="checkbox" />
				{itemProps.label}
			</label>
		);
	};

	buildMultiSelect = (props) => {
		return (
			<List
				id={props.name}
				itemList={props.optionList}
				buildItem={this.buildItem} />
		);
	};

	buildRadioItem = (props) => {
		const cls = classNames("field-item", {
			[props.className]: !!props.className,
		});
		return (
			<label className={cls} >
				<input onClick={props.onClick}
							 checked={this.props.value === props.value}
							 onChange={this.onChange} type="radio"
							 className="radio"
							 name={props.name} value={props.value} />
				{props.label}
			</label>
		);
	}

	buildSingleSelect = (props) => {
		const activeKey = props.optionList.find(
			(option) => {
				return props.value === option.value;
			}
		).key;
		return (
			<DropdownList
				name={props.name}
				className={props.className}
				activeKey={activeKey}
				onClickItem={this.onClickSingleSelectItem}
				itemClass={this.buildRadioItem}
				itemList={props.optionList} />
		);
	};

	buildComponent(props) {
		const field = props.multiple ? this.buildMultiSelect(props) : this.buildSingleSelect(props);
		const cls = classNames({
			[props.className]: !!props.className,
			"g-field-select--multiple": props.multiple,
		});
		return (
			<div className={cls}>
				<span className="field-label">{props.label}</span>
				{field}
			</div>

		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}
