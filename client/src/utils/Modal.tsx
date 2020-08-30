import React, { useContext } from "react";

import { ModalContext } from "../App";

export default () => {
  const [modalState, setModalState] = useContext(ModalContext);

  const { ModalChild } = modalState;
  const { onClickOutside } = modalState.data;

  const _onClickOutside = (e: any) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      cleanUpModal();
    }
    !!onClickOutside && onClickOutside();
  };

  const cleanUpModal = () => {
    setModalState({
      display: false,
      ModalChild: null,
      data: {},
    });
  };

  return (
    <div
      className="modal-container"
      style={!modalState.display ? { display: "none" } : {}}
      onClick={(e) => _onClickOutside(e)}
    >
      <div>
        {ModalChild && (
          <ModalChild
            {...modalState.data}
            onModalCleanup={cleanUpModal}
          ></ModalChild>
        )}
      </div>
    </div>
  );
};
