import React from 'react';
import { ActionSheet, ActionSheetItem, SplitLayout, SplitCol, Snackbar, View, Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, ButtonGroup, FormItem, FixedLayout } from '@vkontakte/vkui';
import { Icon56MoneyCircleFillBlue, Icon24CarOutline, Icon24Qr } from '@vkontakte/icons';
import { Icon28BusOutline, Icon16ErrorCircleFill } from '@vkontakte/icons';
import { Icon20CheckCircleFillGreen } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'
import { useState } from 'react';
import { Icon20StatisticsOutline } from '@vkontakte/icons';

const Home = ({ id, go, STORAGE_KEYS}) => {
    const [resultText, setResultText] = useState(null);
    const [snackbar, setSnackbar] = useState(null);

    const openSnackbar = (icon, text, duration) => {
        if (snackbar) {
            return;
        }
        setSnackbar(<Snackbar duration={duration} before={icon} onClose={() => setSnackbar(null)}>{text}</Snackbar>)
    }

    const pay = () => {
        bridge.send('VKWebAppOpenCodeReader')
            .then((data) => {
                let result = JSON.parse(data.code_data);
                bridge.send('VKWebAppOpenPayForm', {
                    app_id: 51502488,
                    action: 'pay-to-user',
                    params: {
                        user_id: result.user,
                        amount: result.cost,
                        description: "Оплата проезда на маршрутном такси №" + result.route
                    }
                })
                    .then((data) => {
                        if (data.status) {
                          // let info = bridge.send('VKWebAppStorageGet', {keys: STORAGE_KEYS.PAYMENTS});
                          //делаем загрузку как в stats
                            let payment_info = {'amount': result.cost, 'route': result.route, 'date': Date.now()};
                            
                            bridge.send("VKWebAppStorageSet", {
                                key: 'payments',
                                value: JSON.stringify(payment_info)
                            });
                            openSnackbar(< Icon20CheckCircleFillGreen width={16} height={16} />, "Оплата прошла успешно!", 3000);
                        }
                    })
                    .catch((error) => {
                        openSnackbar(< Icon16ErrorCircleFill />, "Извините, что-то пошло не так. Попробуйте позже.", 3000);
                    });
            })
            .catch((error) => {
                if (error.error_data.error_code == 6) {
                    // snackbar
                    openSnackbar(<Icon16ErrorCircleFill />, "Извините, ваша платформа не поддерживает сканирование QR-кода.", 3000)
                }
            });
    }

    const baseTargetRef = React.useRef();

    const showSheet = () => {
        setSnackbar(<ActionSheet onClose={setSnackbar(null)} toggleRef={baseTargetRef} className='home-action-sheet'>
            <ActionSheetItem>
                Привет
            </ActionSheetItem>
        </ActionSheet>)
    }

    return <View style={{ width: "100%" }} popout={snackbar} activePanel={id}>
        <Panel className='home-main-panel' id={id} centered="true">
            <Div className='home-main-container'>
                {<Icon28BusOutline width={56} height={56} fill='#61a2ed' />}
                <h3>Маршрутное такси</h3>
                <p>Оплатите поездку в маршрутном такси с помощью QR-кода, или сгенерируйте код для приёма платежей</p>
                <ButtonGroup gap="m" align="center" mode="vertical" stretched="true">
                    <ButtonGroup stretched={true}>
                        <Button onClick={pay} data-to="passenger" size="m" stretched="true" before={<Icon24Qr />}>Оплатить по QR-коду</Button>
                        <Button size='m' mode='outline' before={<Icon20StatisticsOutline width={24} height={24} onClick={go} data-to='stats' />}></Button>
                    </ButtonGroup>
                    <Button mode='secondary' onClick={go} data-to="vendor" size="m" stretched="true" before={<Icon24CarOutline />}>Я водитель</Button>
                </ButtonGroup>
            </Div>
        </Panel>
    </View>
};

export default Home;