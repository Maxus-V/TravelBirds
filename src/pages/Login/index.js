import LoginForm from "./components/LoginForm"
import welcome from "@/assets/images/login_welcome.png"
import logo from "@/assets/images/login_logo.png"
import "./Login.less"

const Login = () => {
	return (
		<div className="login-container">
			<div className="login-box">
				<div className="login-left">
					<img src={welcome} alt="login" />
				</div>
				<div className="login-form">
					<div className="login-logo">
						<img className="login-icon" src={logo} alt="logo" />
						<span className="logo-text">随风飘飘游</span>
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login