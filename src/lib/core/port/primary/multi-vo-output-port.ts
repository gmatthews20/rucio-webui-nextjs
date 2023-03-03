import { MultiVOError, MultiVOResponse } from "../../data/multi-vo";

/**
 * Defines the output port for the userpass login use case. This interface muse be implemented by the
 * Presenter for the userpass login use case. {@type T} is the type of the presenter i.e. HTTPResponse or other.
 */
export default interface MultiVOOutputPort<T> {
    response: T;
    presentSuccess(responseModel: MultiVOResponse): any;
    presentError(error: MultiVOError): any;
}
