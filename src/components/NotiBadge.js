import React from "react";
import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { realtime } from "../shared/firebase";
import { ref, onValue, off, update } from "firebase/database";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
  const user_id = useSelector(state => state.user.user.uid);

  const [is_read, setIsRead] = React.useState(true);
  const notiCheck = () => {
    const notiDB = ref(realtime, `noti/${user_id}`);
    update(notiDB, { read: true });
    props._onClick();
  };

  React.useEffect(() => {
    const notiDB = ref(realtime, `noti/${user_id}`);

    onValue(notiDB, (snapshot) => {
      //바뀐값(snapshot)을 알아온다
      console.log(snapshot.val());
      setIsRead(snapshot.val().read);
    });

    return () => off(notiDB);
  }, []);

  return (
    <React.Fragment>
      <Badge
        cursor="pointer"
        color="secondary"
        variant="dot"
        invisible={is_read}
        onClick={notiCheck}
      >
        <NotificationsIcon fontSize="large" cursor="pointer"/>
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};
export default NotiBadge;
