import React from 'react';
import { Panel, PanelHeaderBack, PanelHeader, CellButton, FixedLayout, Div, Button, ButtonGroup } from '@vkontakte/vkui';

const QrCode = ({id, go, qrCode}) => {
    return <Panel id={id} className='qrCodeBox'>
            <PanelHeader>
                Готовый QR-код
            </PanelHeader>
            <Div className='qr-code-header-content'>
                <h3>QR-код</h3>
                <p>Используйте получившийся QR-код, чтобы принимать платежи уже сейчас!</p>
            </Div>
            <Div className='qr-code-container'>
                <Div className='qrCode' dangerouslySetInnerHTML={{__html: qrCode}}></Div>
            </Div>
            <FixedLayout vertical='bottom'>
                <Div>
                    <ButtonGroup mode="vertical" stretched={true}>
                        <Button mode='outline' onClick={go} data-to='vendor' size='l' stretched='true'>Назад</Button>
                    </ButtonGroup>
                </Div>
            </FixedLayout>
        </Panel>
}

export default QrCode;