import "./App.css";
import { Row, Col, Tab, Nav } from "react-bootstrap";
import { useFetch } from "@hooks/useFetch";
import { DatabaseToSend } from "@models/types";
import { SitesList } from "@components/SitesList";
import { SitesInput } from "@components/SitesInput/SitesInput";
import { Diffs } from "@components/Diffs/Diffs";

function App() {
    const { data, error, refetch } = useFetch<DatabaseToSend>("/api/get_pages");

    if (error) return <h1>{`error occured: ${error}`}</h1>;

    if (!data) return <h1>loading...</h1>;

    const { PreviousSites, CurrentSites } = data;

    return (
        <Tab.Container defaultActiveKey="previous">
            <Row className="mx-3 mt-4 ">
                <Col xs={2} xl={1}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="previous">Previous</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="current">Current</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="diffs">Diffs</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="previous">
                            <SitesList sites={PreviousSites} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="current">
                            <Row>
                                <Col xs={8}>
                                    <SitesList sites={CurrentSites} />
                                </Col>
                                <Col className="mt-3">
                                    <SitesInput
                                        siteList={Object.keys(CurrentSites)}
                                        refetch={refetch}
                                        collectionName="CurrentSites"
                                    />
                                </Col>
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="diffs">
                            <Diffs data={data} />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default App;
