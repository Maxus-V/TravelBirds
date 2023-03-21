// * Echarts 按需引入
import * as echarts from "echarts/core"
import {
	BarChart,
	// 系列类型的定义后缀都为 SeriesOption
	LineChart,
} from "echarts/charts"
import { LegendComponent } from "echarts/components"
import {
	TitleComponent,
	// 组件类型的定义后缀都为 ComponentOption
	TooltipComponent,
	GridComponent,
	// 数据集组件
	DatasetComponent,
	// 内置数据转换器组件 (filter, sort)
	TransformComponent
} from "echarts/components"
import { LabelLayout, UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"

// 注册必须的组件
echarts.use([
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	BarChart,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
])

export default echarts
