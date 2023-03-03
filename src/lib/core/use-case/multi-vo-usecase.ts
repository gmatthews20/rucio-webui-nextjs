import RucioAuthServer from "@/lib/infrastructure/gateway/rucio-auth-server";
import { injectable } from "inversify";
import { MultiVORequest, MultiVOResponse, MultiVOError } from "../data/multi-vo";
import { VO } from "../entity/auth-models";
import MultiVOInputPort from "../port/primary/multi-vo-input-port";
import type MultiVOOutputPort from "../port/primary/multi-vo-output-port";
import type AuthServerGatewayOutputPort from "../port/secondary/auth-server-gateway-output-port";

/**
 * UseCase for MultiVO workflow.
 */
@injectable()
class MultiVOUseCase implements MultiVOInputPort {
    constructor(
        private presenter: MultiVOOutputPort<any>,
        private authServer: AuthServerGatewayOutputPort
    ) {
        this.presenter = presenter;
    }
    async execute(request: MultiVORequest): Promise<void> {
        const vos = process.env.RUCIO_VOS
        const multi_vo = process.env.RUCIO_MULTI_VO_ENABLED?.toLowerCase() === 'true' && vos
        if(multi_vo) {
            const possibleVos: string[] = vos.replace(/\s+/g, '').split(',')
            const voList: VO[] = []
            for (const vo in possibleVos) {
                const voName = process.env[('RUCIO_VO_' + possibleVos[vo]).toUpperCase()] as string
                const vo_obj: VO = {
                    name: voName ? voName : possibleVos[vo].toUpperCase(),
                    shortName: possibleVos[vo]
                }
                voList.push(vo_obj)
            }
            const responseModel: MultiVOResponse = {
                multiVOEnabled: true,
                voList: voList,
                selectedVO: request.selectedVO
            }
            
            this.authServer.authVO(request.selectedVO.shortName)
            await this.presenter.presentSuccess(responseModel)
            return;
        }

        let error_type: 'MULTI_VO_DISABLED' | 'VOS_UNDEFINED' | 'UNKNOWN_ERROR'
        if(process.env.RUCIO_MULTI_VO_ENABLED?.toLowerCase() !== 'true' && vos){
            error_type = 'MULTI_VO_DISABLED'
        } else if(!vos && process.env.RUCIO_MULTI_VO_ENABLED?.toLowerCase() === 'true') {
            error_type = 'VOS_UNDEFINED'
        } else {
            error_type = 'UNKNOWN_ERROR'
        }
        const errorModel: MultiVOError = {
            type: error_type
        }
        await this.presenter.presentError(errorModel)
        return;
    }
}

export default MultiVOUseCase;
