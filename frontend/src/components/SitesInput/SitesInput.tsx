import { useState, useEffect } from "react";
import {
    ToastError,
    ToastErrorTypes,
    InputErrorTypes,
    InputSuccess,
} from "@fronttypes/types";
import {
    Button,
    ToastContainer,
    Form,
    Row,
    Col,
    Spinner,
    CloseButton,
} from "react-bootstrap";
import { NotificationToast } from "@components/NotificationToast";
import "./SitesInput.css";

export const SitesInput = ({
    refetch,
    siteList,
}: {
    refetch: Function;
    siteList: string[];
}) => {
    const [input, setInput] = useState<string>("");
    const [errors, setErrors] = useState<ToastError[]>([]);
    const [newLinks, setNewLinks] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    //sync inputs via use effect
    useEffect(() => {
        setNewLinks(input.split("\n"));
    }, [input]);

    useEffect(() => {
        setInput(newLinks.join("\n"));
    }, [newLinks]);

    const validateInput = (url: string): InputErrorTypes | InputSuccess => {
        if (siteList.includes(url)) return InputErrorTypes.Duplicate;
        if (!url.length) return InputSuccess.BlankInput;
        let isCorrect = true;
        try {
            new URL(url);
        } catch {
            isCorrect = false;
        }
        return isCorrect
            ? InputSuccess.InputSuccess
            : InputErrorTypes.WrongInput;
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };
    const onSingleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const fug = input.split("\n");
        fug[index] = e.target.value;
        setNewLinks(fug);
    };
    const deleteError = (index: number) => {
        setErrors(errors.filter((_, i) => i !== index));
    };
    const deleteLink = (index: number) => {
        setNewLinks(newLinks.filter((_, i) => i !== index));
    };

    const onSubmit = async () => {
        const linksToSend = input.split("\n").filter((url) => url.length);

        if (!linksToSend.length) {
            setErrors([
                {
                    type: ToastErrorTypes.EmptyInput,
                    value: "Please, input something",
                },
            ]);
            return;
        }

        for (let link of linksToSend) {
            if (validateInput(link) === "wrong") {
                setErrors([
                    {
                        type: ToastErrorTypes.InputError,
                        value: "Some links are incorrect, please fix them",
                    },
                ]);
                return;
            }
        }

        const body = {
            collectionName: "CurrentSites",
            links: linksToSend,
        };

        setLoading(true);
        setErrors([]);

        fetch("http://localhost:5000/api/insert_pages", {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    const err = new Error("Couldn't fetch");
                    err.name = ToastErrorTypes.NotFoundError;
                    throw err;
                }
                return response.json();
            })
            .then((text: string[]) =>
                setErrors(
                    text.map((err) => {
                        return {
                            type: ToastErrorTypes.FailedToFindPage,
                            value: err,
                        };
                    }),
                ),
            )
            .catch((e: Error) => {
                const toastMsg = {} as ToastError;
                toastMsg.type =
                    e.name === ToastErrorTypes.NotFoundError
                        ? e.name
                        : ToastErrorTypes.UnknownError;
                toastMsg.value = e.message;
                setErrors([toastMsg]);
            })
            .finally(() => {
                setTimeout(() => {
                    refetch();
                    setLoading(false);
                    setInput("");
                }, 400);
            });
    };

    return (
        <>
            <ToastContainer
                className="p-3 mb-5"
                position="bottom-end"
                style={{ zIndex: 1 }}
            >
                {errors.map((error, index) => (
                    <NotificationToast
                        variant="danger"
                        closeFunction={() => deleteError(index)}
                        key={index}
                        data={error}
                    />
                ))}
            </ToastContainer>
            <Form.Control
                disabled={loading}
                className="mb-2 mt-3"
                value={input}
                onChange={onInputChange}
                placeholder={`Input links, each in new line\nEach new link will appear in its personal input`}
                as="textarea"
                rows={6}
                style={{ resize: "none" }}
            />
            <div
                style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "60vh",
                }}
            >
                {/*render individual inputs for every new line in global input*/}
                {newLinks.map((url, index) => {
                    const status = validateInput(url);
                    return (
                        <Row key={index}>
                            <Col>
                                <Form.Control
                                    disabled={loading}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onSingleInputChange(e, index)}
                                    value={url}
                                />
                            </Col>
                            <Col xs={4} className={status}>
                                {status}
                            </Col>
                            <Col xs={2}>
                                <CloseButton
                                    disabled={loading}
                                    onClick={() => deleteLink(index)}
                                />
                            </Col>
                        </Row>
                    );
                })}
            </div>
            <Button
                disabled={loading}
                className="mb-2"
                variant="primary"
                onClick={onSubmit}
            >
                {loading && (
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                    />
                )}
                Submit
            </Button>
        </>
    );
};
