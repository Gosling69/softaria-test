import { Row, Col, ListGroup } from "react-bootstrap";
import { CollectionToSend } from "@models/types";

type ListProps = {
    sites: CollectionToSend;
};
export const SitesList = ({ sites }: ListProps) => {
    const siteList = Object.keys(sites);
    if (!sites || !siteList.length) {
        return <h1>No data</h1>;
    }

    return (
        <>
            <Row className="mb-2">
                <Col>Link</Col>
                <Col>Title</Col>
                <Col>Last Modified</Col>
            </Row>
            <ListGroup style={{ overflowY: "auto", height: "85vh" }}>
                {siteList.map((site) => (
                    <ListGroup.Item key={site}>
                        <Row>
                            <Col
                                style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    width: "160px",
                                }}
                            >
                                <a href={site}>{site}</a>
                            </Col>
                            <Col>{sites[site]?.title}</Col>
                            <Col>
                                {sites[site].lastModified && (
                                    <>
                                        {new Date(
                                            sites[site].lastModified!,
                                        ).toUTCString()}
                                    </>
                                )}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};
