import { Switch } from "antd";
import { connect } from "react-redux";
import { setThemeConfig } from "@/redux/modules/global/action";

const SwitchDark = (props) => {
	const { setThemeConfig, themeConfig } = props
	const onChange = (checked) => {
		setThemeConfig({ ...themeConfig, isDark: checked })
	}

	return (
		<Switch
			className="dark"
			defaultChecked={themeConfig.isDark}
			checkedChildren={<>🌞</>}
			unCheckedChildren={<>🌜</>}
			onChange={onChange}
		/>
	)
}

const mapStateToProps = (state) => state.global
const mapDispatchToProps = { setThemeConfig }
export default connect(mapStateToProps, mapDispatchToProps)(SwitchDark)