import classNames from "classnames";
import { props as p } from "tcomb-react";
import Dropdown from "../dropdown/dropdown";
import List from "../list/list";

export type DropdownListPropsType = {
	type: Function,
	className?: string,
	expanded?: boolean,
	activeKey: string,
	onClickItem?: Function,
	itemList: Array<{key: string}>
}

@p(DropdownListPropsType, {strict: false})
export default class DropdownList extends React.Component {
	static displayName = "DropdownList";

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {};
	}

	onClickItem = (itemProps, activeKey) => {
		console.log(itemProps);
		return () => {
			console.log(itemProps);
			this.props.onClickItem(itemProps, activeKey);
		};
	};

	buildHead = (dropdownInstance) => {
		const {activeKey, itemList} = this.props;
		const ItemClass = this.props.type;
		const itemProps = itemList.find((item) => activeKey === item.key);
		return <ItemClass {...itemProps} onClick={this.onClickItem(itemProps, activeKey)} />;
	};

	buildBody = (dropdownInstance) => {
		const {activeKey, itemList} = this.props;
		const ItemClass = this.props.type;
		const filteredItemList = this.props.itemList.filter((item) => activeKey !== item.key);
		return filteredItemList.map((item) =>
			<ItemClass {...item} onClick={this.onClickItem(item, activeKey)} />
		);
	};

	buildPartMap(props,state) {
		return {
			head: this.buildHead,
			body: this.buildBody,
		};
	}

	buildComponent(props,state) {
		const cls = classNames("g-dropdown", {
			[props.className]: !!props.className,
		});

		return (
			<Dropdown buildHead={this.buildHead}
								buildBody={this.buildBody}
								expanded={!!props.expanded} />
		);
	}

	render() {
		return this.buildComponent(this.props);
	}
}
