//====================REACT======================
var Popup = require('../popup/popup');
var Layer = require('../layer/layer');
var Field = require('../field/field');
var Button = require('../button/button');
var Loading = require('../loading/loading');

var Form = React.createClass({
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		id: React.PropTypes.string.isRequired,
		form: React.PropTypes.object.isRequired,
		onSubmit: React.PropTypes.func,
		onClose: React.PropTypes.func,
		buildLayout: React.PropTypes.func,
		buildFormActions: React.PropTypes.func,
		alert: React.PropTypes.object,
		isLoading: React.PropTypes.bool
	},
	statics: {

		serialize(refList, context, callback) {
			let _asyncFieldResult = context._asyncFieldResult || Immutable.Map();

			function checkSerializeFinished(result) {
				//console.log(result.size,refList.length);
				if (result.size === refList.length) {
					callback(result);
				}
			}

			function setSerializedValue(field, fieldID) {
				return mdx(field.props.type, {
					/**
					 * File input is async
					 * @returns {boolean}
					 * */
					"file": ()=> {
						try {
							let FReader = new FileReader();
							FReader.onload = (e)=> {
								_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id, FReader.result);
								checkSerializeFinished(_asyncFieldResult);
							};
							if (field.getValue() && field.getValue()[0]) {
								FReader.readAsDataURL(field.getValue()[0]);
							} else {
								_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id, "");
								checkSerializeFinished(_asyncFieldResult);
							}

						} catch (e) {
							//console.error(e);
							return false;
						}

					}
				}, ()=> {
					let _value = context.refs[fieldID].getValue();
					_value = _value ? _value : "";
					_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id, _value);
					//console.log(_asyncFieldResult.toJS());
					checkSerializeFinished(_asyncFieldResult);
				})
			}

			Immutable.fromJS(refList).map((fieldID)=> {
				setSerializedValue(context.refs[fieldID], fieldID)
			});
		},
		getValidationMsg(refList, context) {
			let _alert;
			try {
			 _alert = Immutable.fromJS(refList).map((fieldID)=> {
					return (context.refs) ? Immutable.fromJS([context.refs[fieldID].props.id, context.refs[fieldID].getValidationMsg ? context.refs[fieldID].getValidationMsg() : undefined]) : undefined;
				}).toKeyedSeq().mapEntries(function (entry) {
					return [entry[1].get(0), entry[1].get(1) ? entry[1].get(1) : undefined];
				}).toMap().filter((val, key)=>!!val);

			} catch (e) {
				console.warn(e);
			}

			//console.log(_alert.toJS());
			return (_alert && _alert.size) ? _alert : undefined;
		}
	},
	getDefaultProps() {
		return {
			buildLayout: function (formLength) {
				return Immutable.fromJS([formLength]);
			}
		}
	},
	getInitialState() {
		return {
			isFormValid: this.isValid(this.props, this.state),
			isSubmitDisabled: false,
			isSubmited: false,
			validateOnMount: false
		}
	},
	componentDidMount() {
		this.setState({
			isFormValid: this.isValid(this.props, this.state)
		});
	},
	serialize(props, state, callback) {
		Form.serialize(props.form.get('field').map((field)=>"field" + field.get("id")).toJS(), this, (result)=> {
			callback(result.set('formID', props.id))
		})
	},
	onChange(name, value, formattedValue, isValid) {

	},
	onSubmit(e) {
		this.forceValidate();
		let isFormValid = this.isValid(this.props, this.state);
		let refList = this.props.form.get('field').map((field)=>"field" + field.get("id")).toJS();

		if (this.props.onSubmit) {
			this.serialize(this.props, this.state, (result)=> {
				//console.log(result.toJS());
				this.props.onSubmit(isFormValid, result.toJS(), this.props.form.get('POST'), Form.getValidationMsg(refList, this));
			});
		}

	},
	onClose(e) {
		this.props.onClose && this.props.onClose(e);
	},
	/**
	 * Tell all form field to reset their value & state to unedited
	 */
	reset() {
		this.props.form.get('field').map((field, index) => {
			var target = this.refs && this.refs['field' + field.get('id')];
			target && target.onChange({target: {value: undefined, edited: false}});
			//target && target.setOriginal();
		});
	},
	/**
	 * Force trigger change event to all form field
	 */
	forceValidate() {
		//console.log("force validate");
		this.props.form.get('field').map((field, index) => {
			var target = this.refs && this.refs['field' + field.get('id')];
			target && target.onChange({target: {value: target.state.activeValue}});
		});
	},
	/**
	 * Check if the form valid
	 * @param props
	 * @param state
	 * @returns {*}
	 */
	isValid(props, state) {
		let _this = this;
		return (_this && _this.refs) ? props.form.get('field').map((field, index) => {
			let _field = _this.refs ? _this.refs['field' + field.get('id')] : undefined;
			return _field ? _field.state.validated : false;
		}).reduce(function (reduction, value, key) {
			return reduction && value;
		}, true) : false;
	},
	/**
	 * Value formatter
	 * @param type
	 */
	formatAs(type) {
		return mdx(type, {
			'date': ()=> {
				return (value)=> {
					return Formatter.date(value, {
						inputDateFormat: 'YYYY/M/D',
						outputDateFormat: 'YYYY/MM/DD'
					});
				}
			}
		});
	},
	buildLoading(props, state) {
		return props.isLoading ? (
			<Layer parent>
				<Loading></Loading>
			</Layer>
		) : null;
	},
	submitByKey(e) {
		//console.log(e);
		if (e.keyCode === 13) {
			this.onSubmit();
		}
	},
	/**
	 * Build all form fields
	 * @param props
	 * @param state
	 * @returns {null}
	 */
	buildFields(props, state) {
		var fields = props.form.get('field');
		var layout = props.buildLayout(fields.size);

		/**
		 * Support form layout e.g array [5,5]
		 * convert list to list of group based on provided layout instruction
		 * @param listToGroup
		 * @param layout
		 * @returns {*}
		 */
		function groupByIndexArray(listToGroup, layout) {
			var layoutCount = layout.get(0);
			if (layout.size) {
				return Immutable.fromJS([listToGroup.take(layoutCount)]).concat(groupByIndexArray(listToGroup.skip(layoutCount), layout.rest()));
			} else {
				return []
			}
		}

		var groupedFields = groupByIndexArray(fields, layout);
		return props.form ?
			groupedFields.map((fieldGroup, index)=> {
				return (
					<fieldset className={"fieldset-"+index} key={"fieldset-"+index}>
						{
							fieldGroup.map((field, index)=> {
								return <Field key={'field' + field.get('id')}
															ref={'field' + field.get('id')}
															validateOnMount={state.validateOnMount}
															formatter={this.formatAs(field.get('type'))}
															onKeyUp={this.submitByKey}
															onChange={this.onChange}
															className="b-field-block" {...field.toObject()} />;
							})
						}
					</fieldset>
				)
			}) : null;
	},
	/**
	 * build form actions
	 * @param props
	 * @param state
	 * @returns {XML}
	 */
	buildAction(props, state) {
		return this.isSuccess(props) ? (
			<div className="actions">
				<Button className="btn" onClick={this.onClose} title="OK"></Button>
			</div>
		) : (
			<div className="actions">
				<Button className="btn" disabled={state.isSubmitDisabled} onClick={this.onSubmit} title="Submit"></Button>
			</div>
		);
	},
	isSuccess(props) {
		return props.result && props.result.get('success');
	},
	buildForm(props, state) {

		var className = cx({
			"b-form": true,
			"is-success": this.isSuccess(props),
			"is-failed": props.result && !props.result.get('success')
		});

		return (
			<div className={className}>
				<form onSubmit={(e)=>{e.preventDefault()}}>
					{props.form ? this.buildFields(props, state) : null}
				</form>
				<div className="actions">
					{props.buildFormActions(this.onSubmit, this.onClose)}
				</div>
				{this.buildLoading(props, state)}
			</div>
		);
	},
	render() {
		return this.buildForm(this.props, this.state);
	}
});

Form.Popup = React.createClass({
	propTypes: {
		device: React.PropTypes.string,
		form: React.PropTypes.object
	},
	buildLayer(props, state) {
		return props.form ? <Layer onClick={props.form.get('decline')}></Layer> : null;
	},
	buildLayout(formName) {
		return mdx(formName, {
			'career': function () {
				return (formLength)=> {
					if (formLength != 14) throw new Error('Invalid career form length: Must be 14');
					return Immutable.fromJS([4, 4, 1, 2, 2, 1]);
				}
			}
		})
	},
	buildPopup(props, state) {
		if (props.form) {
			var {id, content, result, accept, decline, name, thumbnail, contentType} = props.form.toObject();
			var className = cx({
				[name]: !!name,
				"submitted": !!result,
				"submitted--success": result && result.get('success')
			});
			return (
				<Popup device={props.device} className={className} onClose={decline}>
					<div className="content">
						{thumbnail &&
						<div className="thumbnail">
							<Loading></Loading>
						</div>}
						<Form id={id} result={result} onSubmit={accept} form={content} onClose={decline}
									buildLayout={this.buildLayout(name)}/>
					</div>
				</Popup>
			);
		} else return null;
	},
	render() {
		return (
			<div className="b-popup-form">
				{this.buildLayer(this.props, this.state)}
				<ReactCSSTransitionGroup component="div" className="wrapper" transitionName="popup-animation"
																 transitionEnter={true}>
					{this.buildPopup(this.props, this.state)}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
});

module.exports = Form;
