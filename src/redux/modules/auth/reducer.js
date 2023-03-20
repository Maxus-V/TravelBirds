import produce from "immer"
import * as types from "@/redux/mutation-types"

const authState = {
	authButtons: {},
	authRouter: []
}

// auth reducer
const auth = (state = authState, action) =>
	produce(state, draftState => {
		switch (action.type) {
			case types.SET_AUTH_BUTTONS:
				draftState.authButtons = action.authButtons
				break
			case types.SET_AUTH_ROUTER:
				draftState.authRouter = action.authRouter
				break
			default:
				return draftState
		}
	})

export default auth