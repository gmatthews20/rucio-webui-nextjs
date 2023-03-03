import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import CONTROLLERS from "./ioc-symbols-controllers";
import INPUT_PORT from "../../../common/ioc/ioc-symbols-input-port";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import RucioAuthServer from "@/lib/infrastructure/gateway/rucio-auth-server";
import GATEWAYS from "./ioc-symbols-gateway";
import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import UserPassLoginUseCase from "@/lib/core/use-case/userpass-login-usecase";
import UserPassLoginController, {IUserPassLoginController} from "@/lib/infrastructure/controller/userpass-login-controller";
import UserPassLoginPresenter from "@/lib/infrastructure/presenter/usepass-login-presenter";
import MultiVOController, { IMultiVOController } from "../../controller/multi-vo-controller";
import MultiVOInputPort from "@/lib/core/port/primary/multi-vo-input-port";
import MultiVOUseCase from "@/lib/core/use-case/multi-vo-usecase";
import MultiVOPresenter from "../../presenter/multi-vo-presenter";

/**
 * IoC Container configuration for the application.
 */
const appContainer = new Container();

appContainer.bind<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER).to(RucioAuthServer);

appContainer.bind<UserPassLoginInputPort>(INPUT_PORT.USERPASS_LOGIN).to(UserPassLoginUseCase).inRequestScope();
appContainer.bind<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN).to(UserPassLoginController);
appContainer.bind<interfaces.Factory<UserPassLoginInputPort>>(USECASE_FACTORY.USERPASS_LOGIN).toFactory<UserPassLoginUseCase, [IronSession, NextApiResponse]>((context: interfaces.Context) =>
    (session: IronSession, response: NextApiResponse) => {
        const rucioAuthServer: AuthServerGatewayOutputPort = appContainer.get(GATEWAYS.AUTH_SERVER)
        return new UserPassLoginUseCase(new UserPassLoginPresenter(session, response), rucioAuthServer);
    }
);

appContainer.bind<MultiVOInputPort>(INPUT_PORT.MULTIVO).to(MultiVOUseCase).inRequestScope();
appContainer.bind<IMultiVOController>(CONTROLLERS.MULTIVO).to(MultiVOController);
appContainer.bind<interfaces.Factory<MultiVOInputPort>>(USECASE_FACTORY.MULTIVO).toFactory<MultiVOUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const rucioAuthServer: AuthServerGatewayOutputPort = appContainer.get(GATEWAYS.AUTH_SERVER)
        return new MultiVOUseCase(new MultiVOPresenter(response), rucioAuthServer);
    }
);
export default appContainer;