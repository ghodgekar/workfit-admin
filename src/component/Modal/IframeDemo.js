import { Text, Modal, Button } from '@nextui-org/react';
import React from 'react'

export default function IframeDemo(props) {
    const closeHandler = () => {
        props.setshowIframeModal(false)
        console.log("closed");
    };
    return (
        <div>
            <Modal
                closeButton
                blur
                width='700px'
                aria-labelledby="modal-title"
                open={props.showIframeModal}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title"  b size={18}>
                        {props.title}
                    </Text>
                </Modal.Header>
                <Modal.Body css={{margin:"auto"}}>
                    <div dangerouslySetInnerHTML={{__html: props.iframe}}></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
    )
}
