export as namespace srsm;
export = srsm;
type IReactProps = any;
type IEvent<T> = T & {
    listener: (props?: IReactProps) => JSX.Element,
    emit: (data?: string | number | ((data: T) => void | Promise<void>)) => void,
    component: (props?: IReactProps) => JSX.Element,
};

declare function srsm<T>(defaultData?: T, factory?: any): IEvent<T>;

declare namespace srsm {
    export function init<T>(react: any, event: any): void;
}
