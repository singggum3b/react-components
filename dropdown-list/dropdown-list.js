import classNames from "classnames";
import { props as p } from "tcomb-react";
import Dropdown from "../dropdown/dropdown";
import List from "../list/list";

import "./dropdown-list.styl";

export type DropdownListPropsType = {
	type: Function,
	className?: string,
	expanded?: boolean,
	defaultExpanded: boolean,
	activeKey?: string,
	defaultKey?: string,
	onClickItem?: Function,
	itemList: Array<{key: string}>
}

@p(DropdownListPropsType, {strict: false})
export default class DropdownList extends React.Component {
	static displayName = "DropdownList";

	static defaultProps = {
		defaultExpanded: false,
	};

	constructor(props) {
		super(props);
		this.state = {
			activeKey: props.activeKey || props.defaultKey || props.itemList[0].key,
			expanded: typeof props.expanded === "boolean" ? props.expanded : props.defaultExpanded,
		};
	}

	onClickItem = (itemProps, activeKey) => {
		return () => {
			!this.props.activeKey && this.setState({
				activeKey: itemProps.key,
			});

			if (itemProps.key === activeKey) {
				this.setState({
					expanded: !this.state.expanded,
				});
			} else {
				this.setState({
					expanded: false,
				});
			}

			this.props.onClickItem(itemProps, activeKey);
		};
	};

	buildHead = (dropdownInstance) => {
		const {itemList} = this.props;
		const ItemClass = this.props.type;
		const itemProps = itemList.find((item) => this.state.activeKey === item.key);
		const cls = classNames("dropdown-item", {
			[itemProps.className]: !!itemProps.className,
		});
		return (
			<ItemClass
				{...itemProps}
				className={cls}
				onClick={this.onClickItem(itemProps, this.state.activeKey)} />
		);
	};

	buildBody = (dropdownInstance) => {
		const { itemList } = this.props;
		const filteredItemList = itemList.filter((item) => this.state.activeKey !== item.key);
		return <List list={filteredItemList} buildItem={this.buildBodyItem} />;
	};

	buildBodyItem = (itemProps) => {
		const ItemClass = this.props.type;
		const cls = classNames("dropdown-item", {
			[itemProps.className]: !!itemProps.className,
		});
		return (
			<ItemClass
				{...itemProps}
				className={cls}
				onClick={this.onClickItem(itemProps, this.state.activeKey)} />
		);
	};

	buildPartMap(props,state) {
		return {
			head: this.buildHead,
			body: this.buildBody,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeKey !== this.props.activeKey) {
			this.setState({
				activeKey: nextProps.activeKey,
			});
		}
		if (nextProps.expanded !== this.props.expanded) {
			this.setState({
				expanded: nextProps.expanded,
			});
		}
	}

	buildComponent(props,state) {
		const cls = classNames("g-dropdown-list", {
			[props.className]: !!props.className,
		});

		return (
			<Dropdown className={cls} buildHead={this.buildHead}
								buildBody={this.buildBody}
								expanded={state.expanded} />
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}
