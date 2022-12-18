import React from 'react';
import { ActionSheet, ActionSheetItem, Snackbar, View, Panel, Button, Div, ButtonGroup } from '@vkontakte/vkui';
import { Icon24CarOutline, Icon24Qr } from '@vkontakte/icons';
import { Icon28BusOutline, Icon16ErrorCircleFill } from '@vkontakte/icons';
import { Icon20CheckCircleFillGreen } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'
import { useState } from 'react';
import { Icon28MoneyHistoryBackwardOutline } from '@vkontakte/icons';

const Home = ({ id, go }) => {
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
                            try {
                                bridge.send("VKWebAppStorageGet", { keys: ['payments'] }).then((data) => {
                                    if(data.keys) {
                                        let items = [];
                                        if(data.keys.map(x => x.value)[0] != '') {
                                            items = JSON.parse(data.keys.map(x => x.value));
                                        }
                                        items.push({'amount': result.cost, 'route': result.route, 'date': Date.now()});
                                        
                                        bridge.send("VKWebAppStorageSet", {
                                            key: 'payments',
                                            value: JSON.stringify(items)
                                        }).then((data) => { 
                                            if (data.result) {
                                                console.log("SENDED: " + data.result)
                                            }
                                          })
                                          .catch((error) => {
                                            // Ошибка
                                            console.log(error);
                                          });
                                    }
                                });
                            }
                            catch(ex) {
                                //
                            }               
                            openSnackbar(< Icon20CheckCircleFillGreen width={16} height={16} />, "Оплата прошла успешно!", 3000);
                        }
                    })
                    .catch((error) => {
                        openSnackbar(< Icon16ErrorCircleFill />, "Что-то пошло не так, попробуйте позже.", 3000);
                    });
            })
            .catch((error) => {
                switch(error.error_data.error_code) {
                    case 6:
                        openSnackbar(<Icon16ErrorCircleFill />, "Ошибка! Ваша платформа не поддерживает сканирование QR-кода.", 3000)
                        break;
                    
                    case 4:
                        break;

                    default:
                        openSnackbar(<Icon16ErrorCircleFill />, "Произошла неизвестная ошибка, попробуйте позже.", 3000)
                        break;
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

    return <View style={{ width: "100%" }} popout={snackbar} activePanel={'home'}>
        <Panel className='home-main-panel' id={id} centered="true">
            <Div className='home-main-container'>
                {<Icon28BusOutline width={56} height={56} fill='#61a2ed' />}
                <h3>Маршрутное такси</h3>
                <p>Оплачивайте проезд в маршрутном такси с помощью QR-кода не выходя ВКонтакте, или принимайте платежи с помощью смартфона</p>
                <ButtonGroup gap="m" align="center" mode="vertical" stretched="true">
                    <ButtonGroup stretched={true}>
                        <Button onClick={pay} data-to="passenger" size="m" stretched="true" before={<Icon24Qr />}>Оплатить по QR-коду</Button>
                        <Button size='m' mode='outline' before={<Icon28MoneyHistoryBackwardOutline width={20} height={20} onClick={go} data-to='stats'/>}></Button>
                    </ButtonGroup>
                    <Button mode='secondary' onClick={go} data-to="vendor" size="m" stretched="true" before={<Icon24CarOutline />}>Я водитель</Button>
                </ButtonGroup>
            </Div>
        </Panel>
    </View>
};

export default Home;