import React from "react";
import { ITournament } from "../common/Tournament.Interface";

export default (props: any) => {
  return (
    <div>{`Tournament ${props.location.state.name} with ID ${props.location.state.eventId} `}</div>
  );
};
