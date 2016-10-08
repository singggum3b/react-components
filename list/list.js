import classNames from "classnames";
import { propTypes } from "tcomb-react";

/**
 * @name List
 * @description a component which builds a list item with your own template
 * @example
 * <List list={filteredItemList} buildItem={this.buildBodyItem} />
 */

export type ListPropsType = {
	itemList: Array<{[key:string]: any}>,
	buildItem: Function,
	className?: string,
}

const buildItem = (props, item) => {
	return props.buildItem(item);
}

export default function List(props) {
	const cls = classNames(List.displayName, {
		[props.className]: !!props.className,
	});
	return (
		<div className={cls}>
			{
				props.itemList.map((item) => {
					return buildItem(props, item);
				})
			}
		</div>
	)
}
List.propTypes = propTypes(ListPropsType, { strict: false });
List.displayName = "g-list";
