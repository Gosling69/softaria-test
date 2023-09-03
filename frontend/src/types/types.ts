export enum ToastErrorTypes {
    InputError = "Input Error",
    FailedToFindPage = "Failed To Find Page",
    EmptyInput = "No data has been provided",
    UnknownError = "Unknown Error Occured",
    NotFoundError = "Failed to send request",
}
export type ToastError = {
    type: ToastErrorTypes;
    value: string;
};
// export type ToastSuccess = {
//     type: "Success"
//     value : string
// }
export type ToastMessage = ToastError;

export enum InputErrorTypes {
    Duplicate = "duplicate",
    WrongInput = "wrong",
}
export enum InputSuccess {
    InputSuccess = "success",
    BlankInput = "",
}
