import { props as p } from "tcomb-react";

type ListPropsType = {
	list: Array<Object>,
	buildItem: Function,
	className?: string,
}

@p(ListPropsType, {strict: false})
export default class List extends React.Component {
	static displayName = "g-list";

	buildItem(item) {
		return this.props.buildItem(item);
	}

	buildComponent(props,state) {
		return (
			<div className={props.className || this.constructor.displayName}>
				{
					this.props.list.map((item) => {
						return this.buildItem(item);
					})
				}
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props,this.state);
	}
}
