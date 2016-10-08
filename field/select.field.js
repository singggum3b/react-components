import classNames from "classnames";
import { props as p } from "tcomb-react";
import DropdownList from "../dropdown-list/dropdown-list";
import List from "../list/list";
import "./select.field.styl"

export type SelectFieldPropsType = {
	name?: string,
	label?: string,
	validated?: boolean,
	edited?: boolean,
	onChange?: Function,
	className?: string,

	multipleChoice: boolean,
	value: Array<{key: string}>,
	activeValue?: Array<string>,

	// props of dropdownlist
	expanded?: boolean,
	defaultExpanded?: boolean,
	activeKey?: string,
	defaultKey?: string,
	onClickItem?: Function,
	itemClass?: Function,
}
@p(SelectFieldPropsType, {strict: false})
export default class SelectField extends React.Component {
	static displayName = "SelectField";

	static defaultProps = {
		validated: true,
		edited: false,
		multipleChoice: false,
		activeValue: [],
	};

	constructor(props) {
		super(props);
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
	}

	onMouseLeave = () => {
		!this.props.disabled && this.setState({ hovering: false });
	}

	buildItem = (itemProps) => {
		const cls = classNames("dropdown-item", {
			[itemProps.className]: !!itemProps.className,
			"selected": this.props.activeValue.includes(itemProps.key),
			"hovering": this.state.hovering,
		});
		return (
			<label
				className={cls}
				key={itemProps.key}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				<input type="checkbox" value={itemProps.key} onChange={this.onChange} className="checkbox" />
				{itemProps.title}
			</label>
		)
	};

	buildMultiSelect = (props) => {
		const cls = classNames("g-dropdown-list", {
			[props.className]: !!props.className,
		});
		return (
			<List
				id={props.name}
				className={cls}
				itemList={props.value}
				buildItem={this.buildItem}
			/>
		);
	};

	buildSingleSelect = (props) => {
		if (!props.itemClass)
			throw new Error("Single select requires 'itemClass' props");

		return (
			<DropdownList
				name={props.name}
				className={props.className}
				expanded={props.expanded}
				defaultExpanded={props.defaultExpanded}
				activeKey={props.activeKey}
				defaultKey={props.defaultKey}
				onClickItem={props.onClickItem}
				itemClass={props.itemClass}
				onChange={props.onChange}
				itemList={props.value}
			/>
		);
	};

	buildComponent(props) {
		const field = props.multipleChoice ? this.buildMultiSelect(props) : this.buildSingleSelect(props);
		return (
			<div className={props.className}>
				<span className="item-label">{props.label}</span>
				{field}
			</div>

		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}
