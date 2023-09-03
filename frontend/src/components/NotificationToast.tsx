import { useState, useEffect } from "react";
import { ToastMessage } from "@fronttypes/types";
import { Toast } from "react-bootstrap";
import { Variant } from "react-bootstrap/types";

type ToastProps = {
    data: ToastMessage;
    closeFunction?: Function;
    variant: Variant;
};

export const NotificationToast = ({
    data,
    closeFunction,
    variant,
}: ToastProps) => {
    const [show, setShow] = useState<boolean>(false);
    const { type, value } = data;

    useEffect(() => {
        if (value.length && !show) {
            setShow(true);
        }
    }, [value, show]);

    const onClose = () => {
        setShow(false);
        if (closeFunction) {
            closeFunction();
        }
    };

    return (
        <Toast bg={variant} show={show} onClose={() => onClose()}>
            <Toast.Header closeButton={true}>
                <strong className="me-auto">{type}</strong>
            </Toast.Header>
            <Toast.Body>{value}</Toast.Body>
        </Toast>
    );
};
