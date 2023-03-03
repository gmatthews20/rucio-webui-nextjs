import { MultiVOError, MultiVOResponse } from "@/lib/core/data/multi-vo";
import MultiVOOutputPort from "@/lib/core/port/primary/multi-vo-output-port";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import type { MultiVOViewModel } from "../data/multi-vo/multi-vo";


/**
 * Provides an implementation of the {@link MultiVOOutputPort} interface.
 * This implementation is injected into the {@link MultiVOUseCase} via the IoC container.
 */
export default class MultiVOPresenter implements MultiVOOutputPort<MultiVOResponse> {
    response: MultiVOResponse;

    constructor(response: MultiVOResponse) {
        this.response = response;
    }

    async presentSuccess(responseModel: MultiVOResponse) {
        const viewModel: MultiVOViewModel = {
            multiVOEnabled: responseModel.multiVOEnabled,
            voList: responseModel.voList,
            selectedVO: responseModel.selectedVO,
        }

        this.response = viewModel
        // console.log(this.response)
        // console.log('stop')
        return
        
    }

    async presentError(error: MultiVOError) {
        const viewModel: MultiVOViewModel = {
            multiVOEnabled: false,
            voList: [],
            selectedVO: {},
        }
        this.response = viewModel
        return
    }
}