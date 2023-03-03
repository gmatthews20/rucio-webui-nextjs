import { UserPassLoginAuthServerDTO } from "../../data/auth-server-dto";

export default interface AuthServerGatewayOutputPort { 
    userpassLogin(username: string, password: string, account: string): Promise<UserPassLoginAuthServerDTO>
    authVO(vo: string): void
}