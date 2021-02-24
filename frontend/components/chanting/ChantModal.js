import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantWindow from "@/components/chanting/ChantWindow";
import Loading from "@/components/Loading";

const CCB_URL =
  "https://pujas-live.sfo3.digitaloceanspaces.com/chantest/ccb.json";

const fetchData = async () => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const data = await (await fetch(CCB_URL)).json();

  data.chants = {
    chantMap: data.chants.reduce((map, chant) => {
      map[chant.id] = chant;
      return map;
    }, {}),
    chants: data.chants,
  };

  data.toc.forEach((volume) => {
    volume.parts.forEach((part) => {
      if (volume.volume == 1 && (part.part == 1 || part.part == 2)) {
        part.chantSet.pop();
        part.chants = part.chants.slice(-1);
      } else if (volume.volume == 2 && part.part == 3) {
        part.chants = [];
      } else if (volume.volume == 1 && part.part == 4) {
        part.chants.shift(); // Remove Añjali
      }
      part.chants.forEach((chant) => {
        if (!chant.chantSet && !(volume.volume == 2 && part.part == 2)) {
          chant.chantSet = [chant.link];
        }
      });
    });
  });

  return data;
};

const ChantModal = ({ onClose, open }) => {
  const mobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (open && !data) {
      fetchData()
        .then((data) => setData(data))
        .catch(console.error);
    }
  }, [data, open]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div>
            <ChantFontStyle />
            <Loading queryResult={{ data, loading: open && !data }}>
              {({ data: { chants, toc } }) => (
                <ChantWindow
                  chants={chants}
                  mobile={mobile}
                  onClose={onClose}
                  toc={toc}
                />
              )}
            </Loading>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default ChantModal;
