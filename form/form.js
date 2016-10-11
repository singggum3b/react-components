import classNames from "classnames";
import {match} from "toolbelt";
import {props as p} from "tcomb-react";
import Field from "../field/field";

export type FormStatusType = {
	code: "SUCCESS" | "FAILED" | "LOADING",
	message?: string,
};

export type FormPropsType = {
	id: string,
	status?: FormStatusType,
	fieldList: Array<{name: string}>,
	formLayout?: Array<number>,
	onSubmit?: Function,
	onDismiss?: Function,
	buildFormActions?: Function,
	isLoading?: boolean,
	validator?: Function,
}

@p(FormPropsType)
export default class Form extends React.Component {

	static defaultProps = {};

	constructor(props) {
		super(props);
	}

	serialize() {
		// TODO: Return serialize data from child field.
	}

	validate() {
		/* TODO:
			1. Get form serialized data
			2. Pass it to validator and get back errorMsg object
			3. Update state with new errorMsg object
		*/

	}

	onSubmit() {

	}

	onDismiss() {

	}

	reset() {

	}

	forceValidate() {

	}

	buildFields(props, state) {
		const { fieldList, formLayout } = props;
		const groupedFields = groupByIndexArray(fieldList, formLayout || [fieldList.length]);

		return groupedFields.map((fieldGroup, index) => {
			return (
				<fieldset className={"fieldset-"+index} key={"fieldset-"+index}>
					{
						fieldGroup.map((field) => {
							return (
								<Field key={"field" + field.name}
											 ref={"field" + field.name}
											 onKeyUp={this.onFieldKeyup}
											 onChange={this.onFieldChange}
											 {...field} />
							);
						})
					}
				</fieldset>
			);
		});
	}

	buildFormActions(formInstance) {

	}

	buildComponent(props, state) {

		const className = classNames({
			"g-form": true,
			"is-success": props.status && props.status.code === "SUCCESS",
			"is-failed": props.status && props.status.code === "FAILED",
		});

		return (
			<div className={className}>
				<form onSubmit={(e) => { e.preventDefault(); }}>
					{props.fieldList ? this.buildFields(props, state) : null}
				</form>
				{/*<div className="actions">
					{props.buildFormActions(this)}
				</div>*/}
			</div>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}

}

/**
 * Support form layout e.g array [5,5]
 * convert list to list of group based on provided layout instruction
 * @param listToGroup
 * @param layout
 * @returns {*}
 */
function groupByIndexArray(listToGroup, layout) {

	if (layout && layout.length) {
		const numberOfItem = layout[0];
		const groupedArray = [];
		groupedArray.push(listToGroup.slice(0, numberOfItem));
		return groupedArray.concat(groupByIndexArray(listToGroup.slice(numberOfItem), layout.slice(1)));
	}

	return [];
}
