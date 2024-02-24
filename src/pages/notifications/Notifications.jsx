import React from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";

const Notifications = props => {
    return (
        <>
            <Title title={"Notificações"} crumbs={props.crumbs} />
            <Card>
                <h2>Card</h2>
            </Card>
        </>
    );
};

export default Notifications;
