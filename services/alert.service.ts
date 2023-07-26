import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

// Define the AlertTypes constant (plural)
export const AlertTypes = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
} as const;

// Define the Alert type
export interface Alert {
    fade: any;
    keepAfterRouteChange: unknown;
    id?: string;
    type: typeof AlertTypes[keyof typeof AlertTypes];
    message: string;
    autoClose?: boolean;
}

const alertSubject = new Subject<Alert>();
const defaultId = 'default-alert';

// Enable subscribing to alerts observable
function onAlert(id = defaultId) {
    return alertSubject.asObservable().pipe(
        filter((x: Alert) => x && x.id === id)
    );
}

// Convenience methods
function success(message: string, options: any) {
    alert({ ...options, type: AlertTypes.Success, message });
}

function error(message: string, options: any) {
    alert({ ...options, type: AlertTypes.Error, message });
}

function info(message: string, options: any) {
    alert({ ...options, type: AlertTypes.Info, message });
}

function warn(message: string, options: any) {
    alert({ ...options, type: AlertTypes.Warning, message });
}

// Core alert method
function alert(alert: Alert) {
    alert.id = alert.id || defaultId;
    alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
    alertSubject.next(alert);
}

// Clear alerts
function clear(id = defaultId) {
    alertSubject.next({
        id,
        type: 'Success',
        message: '',
        fade: undefined,
        keepAfterRouteChange: undefined
    });
}

export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear
};
