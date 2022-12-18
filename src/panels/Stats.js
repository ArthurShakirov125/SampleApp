import bridge from '@vkontakte/vk-bridge';
import { List, Text, Panel, FixedLayout, PanelHeader, Header, Button, Group, Div, Placeholder, Separator, Title } from '@vkontakte/vkui';
import { Icon28BusOutline } from '@vkontakte/icons';
import { useEffect, useState } from 'react';

const Keys = {
    payments: 'payments'
}

const Stats = ({ go, id }) => {
    const [payments, setPayments] = useState(null);

    useEffect(() => {
        async function fetchData() {
            bridge.send("VKWebAppStorageGet", { keys: ['payments'] }).then((data) => {
                if (data.keys) {
                    let items = [];
                    if (data.keys.map(x => x.value)[0] != '') {
                        items = JSON.parse(data.keys.map(x => x.value));
                    }
                    setPayments(items);
                }
            });
        }
        fetchData();
    }, [])

    return <Panel id={id}>
        <PanelHeader>История поездок</PanelHeader>
        <Panel>
            <List className='history-list'>
                {(payments && payments.length > 0) && payments.map(x =>
                    <Group key={payments.indexOf(x)} separator={<Separator wide={true} />}>
                        <Div className='history-wrapper'>
                            <Title className='history-item-title' level={1} >
                                <Icon28BusOutline fill='#61a2ed' style={{ marginRight: '10px' }} />Поездка в {new Date(x.date).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </Title>
                            <Text className='history-item-details'>{x.amount}₽, по маршруту №{x.route}</Text>
                        </Div>
                    </Group>
                )}
                {(!payments || (payments && payments.length == 0)) && <Placeholder>История поездок пока что пуста</Placeholder>}
            </List>
        </Panel>
        <FixedLayout vertical='bottom'>
            <Div>
                <Button size='l' mode='primary' stretched='true' onClick={go} data-to='home'>Назад</Button>
            </Div>
        </FixedLayout>
    </Panel>
}


export default Stats