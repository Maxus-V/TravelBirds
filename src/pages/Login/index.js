import SwitchDark from "@/components/SwitchDark"
import LoginForm from "./components/LoginForm"

import welcome from "@/assets/images/login_welcome.png"
import logo from "@/assets/images/login_logo.webp"

import { useTranslation } from "react-i18next"
import "./Login.less"

const Login = () => {
	const { t } = useTranslation()
	return (
		<div className="login-container">
			{/* <SwitchDark /> */}
			<div className="login-box">
				<div className="login-left">
					<img src={welcome} alt="login" />
				</div>
				<div className="login-form">
					<div className="login-logo">
						<img className="login-icon" src={logo} alt="logo" />
						<span className="logo-text">{t("login.title")}</span>
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login