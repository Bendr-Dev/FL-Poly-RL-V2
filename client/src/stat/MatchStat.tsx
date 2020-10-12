import React, { useEffect, useState } from "react";
import { IStat } from "../../../common/interfaces/Stat.Interface";
import { getData } from "../utils/http";

export default (props: any) => {
  const [stats, setStats] = useState<IStat>();

  useEffect(() => {
    const getMatchStats = async () => {
      const [error, stats]: any = await getData( `/api/tournaments/match/${props.location.state._id}`);

      if (error) {
        console.error(error);
      }

      !!stats && setStats(stats);
      console.log(stats);
    }
    getMatchStats();
  }, [])
  
if(stats) {
  return (
    <div>
      <div></div>
    </div> );
} else {
  return <div>Uh oh stinky</div>
}

};
