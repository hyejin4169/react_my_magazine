import React from "react";
import { ref, orderByChild, query, onValue } from "firebase/database";
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

import { Grid } from "../elements/Index2";
import Card from "../components/Card";

const Notification = (props) => {
  const user = useSelector((state) => state.user.user);
  const [noti, setNoti] = React.useState([]);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const notiDB = ref(realtime, `noti/${user.uid}/list`);
    const _noti = query(notiDB, orderByChild("insert_dt"));

    onValue(_noti, (snapshot) => {
      if (snapshot.exists()) {
        let _data = snapshot.val();

        //배열.reverse 해주면 역순 정렬
        let _noti_list = Object.keys(_data).reverse().map((s) => {
            return _data[s];
        });

        console.log("_noti_list : ", _noti_list);
        setNoti(_noti_list);
      }
    });
  }, [user]); //user정보가 업데이트되며 다시 한 번 여기로 들어옴

  return (
    <React.Fragment>
      <Grid padding="16px" bg="#EFF6FF">
        {noti.map((n, idx) => {
          return <Card key={`noti_${idx}`} {...n}></Card>;
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;
