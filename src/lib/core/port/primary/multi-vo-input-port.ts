import { injectable } from "inversify";
import { MultiVORequest } from "../../data/multi-vo";

/**
 * InputPort for UserPassLogin workflow. This is implemented by {@link UserPassLoginUseCase}
 */
@injectable()
export default interface MultiVOInputPort {
    execute(request: MultiVORequest ): void;
}
