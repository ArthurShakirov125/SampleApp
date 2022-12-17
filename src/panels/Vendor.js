import React, { Fragment } from 'react';
import { Panel, View, PanelHeader, Button, Group, Div, ButtonGroup, FormLayout, FormItem, Input, Snackbar } from '@vkontakte/vkui';
import { Icon16ErrorCircleFill, Icon56Stars3Outline, Icon24Back, Icon24Qr, Icon24HomeOutline } from '@vkontakte/icons';
import qr from '@vkontakte/vk-qr';

const Vendor = ({id, go, fetchedUser, setThisPanel, setQrCode}) => {

    const [snackbar, setSnackbar] = React.useState(null);

    const routeNumber = React.createRef();
    const fare = React.createRef();

    const openErrorSnackbar = () => {
        if(snackbar) {
            return;
        }
        setSnackbar(<Snackbar duration={3000} before={<Icon16ErrorCircleFill/>} onClose={() => setSnackbar(null)}>Ошибка! Не все поля были заполнены.</Snackbar>)
    }

    const showQrCode = () => {
        const driverId = fetchedUser.id;
        if(fare.current.value.trim() == '' || routeNumber.current.value.trim() == '') {
            openErrorSnackbar();
            return;
        }
        const options = {};
        options.isShowLogo = true;
        options.isShowBackground = true;

        setQrCode(qr.createQR(JSON.stringify({user: driverId, cost: parseInt(fare.current.value), route: parseInt(routeNumber.current.value)}), 1024, 'qr-code-class', options));

        setThisPanel('qrCode');
    }

    return <View popout={snackbar} activePanel={id}>
            <Panel id={id} centered={true}>
            <PanelHeader className='panel-header-container'>
                Данные о поездке
            </PanelHeader>
            <Div className='vendor-main'>
            {<Icon56Stars3Outline fill='#61a2ed'/>}
            <h3>Осталось три клика</h3>
            <p>Укажите номер маршрута, стоимость проезда, и сгенерируйте свой QR-код</p>
                <Group className='vendor-input-container'>
                    <FormLayout className='vendor-input-form' stretched="true">
                            <FormItem stretched="true" top="Укажите номер маршрута">
                                <Input stretched="true" getRef={routeNumber} type="text"></Input>
                            </FormItem>
                            <FormItem stretched="true" top="Укажите стоиомость проезда">
                                <Input stretched="true" getRef={fare} type="number"></Input>
                            </FormItem>
                            <FormItem stretched="true">
                                <ButtonGroup stretched={true} mode="vertical">
                                    <Button size="m" stretched="true" onClick={showQrCode} data-to='qrCode' before={<Icon24Qr/>}>Сгенерировать QR-код</Button>
                                    <Button size="m" stretched="true" mode='outline' onClick={go} data-to='home' before={<Icon24HomeOutline/>}>На главную</Button>
                                </ButtonGroup>
                            </FormItem>
                    </FormLayout>
                </Group>
            </Div>
        </Panel>
    </View>
}

export default Vendor