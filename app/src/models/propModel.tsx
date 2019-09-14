import { RouteComponentProps } from 'react-router-dom';

export interface Props<Input=any, State=any, Dispatcher=any> extends Partial<RouteComponentProps<any>>, React.HTMLAttributes<HTMLAllCollection> {
    state?: State;
    input?: Input;
    dispatcher?: Dispatcher;
}