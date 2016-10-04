import classNames from "classnames";
import { match } from "toolbelt";
import { props as p } from "tcomb-react";
import "./button.styl";

/**
 * @name Button
 * @description A generic button, which supports button and button with href.
 * In term of display, this component supports 3 types: text only, icon only, text & icon
 * @example
 * <button mode='both' title='Submit' subtitle='Click here to post this article'
 * 		   icon='Icon.png' iconHover='IconHover.png' >
 * </button>
 */

export type ButtonPropsType = {
	mode: "text" | "icon" | "both",
	target?: "_self" | "_blank" | "_parent" | "_top",
	href?: string,
	active?: boolean, // set this prop if using toggle
	disabled?: boolean,
	tabIndex?: number,
	title: string,
	subtitle?: string,
	icon?: string,
	iconHover?: string,
	iconActive?: string,
	onClick?: Function,
	className?: string,
}

@p(ButtonPropsType, {strict: false})
export default class Button extends React.Component {
	static displayName = "Button";

	static defaultProps = {
		mode: "text",
		disabled: false,
		tabIndex: 0,
		subtitle: '',
	}

	constructor(props) {
		super(props);
		this.state = {
			active: !!props.active,
			hovering: false,
		};
		if (props.href && props.onClick)
			throw new Error("Button cannot have both href and onClick props");
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active && typeof this.props.active === "boolean") {
			this.setState({
				active: nextProps.active,
			});
		}
	}

	onClick = (e) => {
		if (this.props.disabled) return e.preventDefault();
		if (!this.props.href && typeof this.props.active === "boolean") {
			this.setState({ active: !this.state.active });
		}
		this.props.onClick && this.props.onClick(e);
	};

	onMouseOver = () => {
		!this.props.disabled && this.setState({ hovering: true });
	}

	onMouseOut = () => {
		!this.props.disabled && this.setState({ hovering: false });
	}

	buildButton(props, state) {

		const icon = (state.active && props.iconActive) ? props.iconActive :
					 ((state.hovering && props.iconHover) ? props.iconHover : props.icon);

		return match(props.mode, {
			"text": () => {
				return (
					<span className="label-wrapper">
						<span className="label">{props.title}</span>
						{!!props.subtitle && <span className="sub-label">{props.subtitle}</span>}
					</span>
				)
			},
			"icon": () => {
				return (
					<span className="icon-wrapper">
						<img className="icon" src={icon} alt="Icon" />
					</span>
				)
			},
			"both": () => {
				return [
					<span key="icon-wrapper" className="icon-wrapper">
						<img className="icon" src={props.icon} alt="Icon" />
					</span>,
					<span key="label-wrapper" className="label-wrapper">
						<span className="label">{props.title}</span>
						{!!props.subtitle && <span className="sub-label">{props.subtitle}</span>}
					</span>
				]
			}
		})
	}

	buildComponent(props, state) {
		const _buttonClasses = classNames({
			"g-button": true,
			"g-button--link": !!props.href,
			"g-button--icon": !!props.icon,
			"active": state.active,
			"hovering": state.hovering,
			"disabled": props.disabled,
			[props.className]: !!props.className,
		});

		const newProps = {
			className: _buttonClasses,
			href: props.href,
			target: props.target,
			title: props.title,
			onClick: this.onClick,
			onTouchStart: this.onClick,
			onMouseEnter: this.onMouseOver,
			onMouseLeave: this.onMouseOut,
		};

		return !props.href ? (
			<button {...newProps}>
				{this.buildButton(props, state)}
			</button>
		) : (
			<a {...newProps}>
				{this.buildButton(props, state)}
			</a>
		);
	}

	render() {
		return this.buildComponent(this.props, this.state);
	}
}
