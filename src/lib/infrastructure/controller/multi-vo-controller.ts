import { MultiVORequest } from "@/lib/core/data/multi-vo";
import { VO } from "@/lib/core/entity/auth-models";
import MultiVOInputPort from "@/lib/core/port/primary/multi-vo-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

/**
 * Declares an interface to initiate the UserPassLogin workflow via the {@link MultiVOUseCase}
 */
export interface IMultiVOController {
    handle(vo: VO, response: NextApiResponse): void;
}

/**
 * Provides an implementation of the {@link MultiVOController} interface.
 */
@injectable()
class MultiVOController implements IMultiVOController {
    private useCase: MultiVOInputPort | null = null;
    private useCaseFactory: (vo: VO, response: NextApiResponse) => MultiVOInputPort;
    
    public constructor(
        @inject(USECASE_FACTORY.MULTIVO) useCaseFactory: (vo: VO, response: NextApiResponse) => MultiVOInputPort,
      ) {
        this.useCaseFactory = useCaseFactory;
      }

    async handle(vo: VO, response: NextApiResponse) {
        this.useCase = this.useCaseFactory(vo, response);
        const requestModel: MultiVORequest = {
            selectedVO: vo
        }
        await this.useCase.execute(requestModel);
    }
}

export default MultiVOController
