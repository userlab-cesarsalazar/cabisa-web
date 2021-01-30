//Libs
import React from "react";
import PropTypes from "prop-types";

//Components
import { Spin } from "antd";

function UISpinner(props) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Spin size={props.size} />
            <span>{props.title}</span>
        </div>
    );
}

UISpinner.defaultProps = {
    size: "large",
    title: "Loading",
};

UISpinner.propTypes = {
    size: PropTypes.oneOf(["small", "default", "large"]),
    title: PropTypes.string,
};

export default UISpinner;
