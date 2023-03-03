import { VO } from "../entity/auth-models";
import MultiVOOutputPort from "../port/primary/multi-vo-output-port";

/**
 * RequestModel for {@link MultiVOInputPort}
 */
export type MultiVORequest = {
    selectedVO: VO
}

/**
 * ResponseModel for {@link MultiVOOutputPort}
 */
export type MultiVOResponse = {
    multiVOEnabled: boolean;
    voList: VO[];
    selectedVO: VO;
}

/**
 * ErrorModel for {@link MultiVOPort}
 */
export type MultiVOError = {
    type: string;
}
