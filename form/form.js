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

export type ErrorObject = {
	[fieldName: string]: {
		message: string
	}
}

@p(FormPropsType)
export default class Form extends React.Component {

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {};
	}

	getSerializedValue() {
		// TODO: Return serialize data from child field.
		const fieldInstanceMap = this.fieldInstanceMap;
		return new Promise((resolve, reject) => {
			const resultPromiseList = Object.keys(fieldInstanceMap).map((fieldName) => {
				let fieldValue = fieldInstanceMap[fieldName].getValue();
				if (fieldValue.then) {
					return fieldValue.then((result) => {
						return Promise.resolve({
							fieldName,
							value: result,
						});
					});
				} else {
					return Promise.resolve({
						fieldName,
						value: fieldValue,
					})
				}
			});
			return Promise.all(resultPromiseList).then((result) => {
				resolve(result);
			}, () => {
				reject();
			});
		});
	}

	validate = () => {
		const serializedDataPromise = this.getSerializedValue();
		serializedDataPromise.then(
			(serializedData) => {
				const formData = serializedData.reduce((result, fieldData) => {
					return Object.assign(result, {
						[fieldData.fieldName]: fieldData.value,
					})
				},{});
				const errorObject = this.props.validator(formData);
				if (!errorObject) {
					// No error object , form is valid
					this.setState({
						errorObject: undefined,
						validated: true,
					});
				} else if (errorObject.then) {
					// Validator return a promise
					errorObject.then((result) => {
						// The promise resolve , form is valid
						this.setState({
							errorObject: undefined,
							validated: true,
						});
					}, (err) => {
						// The promise reject with an errorObject , form is invalid
						this.setState({
							errorObject: err,
						});
					})
				} else {
					// Form is invalid
					this.setState({
						errorObject,
					});
				}
			},
			(err) => {
				this.setState({
					validated: false,
				});
				console.error(err);
				throw new Error("There were error when trying to serialize field data");
			});
	}

	onSubmit() {

	}

	onDismiss() {

	}

	reset() {

	}

	forceValidate() {

	}

	addFieldRef = (name) => {
		return (fieldInstance) => {
			this.fieldInstanceMap = Object.assign(
				{}, this.fieldInstanceMap, {
					[name]: fieldInstance,
				})
		}
	};

	buildFields(props, state) {
		const {errorObject} = state;
		const {fieldList, formLayout} = props;
		const groupedFields = groupByIndexArray(fieldList, formLayout || [fieldList.length]);

		return groupedFields.map((fieldGroup, index) => {
			return (
				<fieldset className={"fieldset-"+index} key={"fieldset-"+index}>
					{
						fieldGroup.map((field) => {

							const error = errorObject ? errorObject[field.name] : undefined;

							return (
								<Field key={"field" + field.name}
											 errorMsg={error && error.message}
											 ref={this.addFieldRef(field.name)}
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
		return this.props.buildFormActions ?
			this.props.buildFormActions(formInstance)
			:
			[
				<button key="validate-btn" onClick={formInstance.validate}>Validate Form</button>
			]
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
				<div className="actions">
					{this.buildFormActions(this)}
				</div>
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
