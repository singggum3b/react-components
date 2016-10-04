import classNames from "classnames";
import { propTypes } from "tcomb-react";

export type LoadingPropsType = {
	title?: string,
	className?: string,
	isFullPage?: boolean,
	loadingImage?: string,
}

export default function Loading(props) {
	const _className = classNames({
		"b-loading": true,
		[props.className]: props.className,
		"b-loading--page": props.isFullPage
	});
	return (
		<div className={_className}>
			<div className="wrapper">
				{props.loadingImage && <img src={props.loadingImage} alt="Preloader"/>}
				<p>
					{props.title}
				</p>
			</div>
		</div>
	)
}

Loading.propTypes = propTypes(LoadingPropsType, { strict: false });
Loading.displayName = "Loading";
Loading.defaultProps = {
	title: "Loading.."
};

