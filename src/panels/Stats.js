import React, { Fragment } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel, FixedLayout, PanelHeader, InfoRow, Header, Button, Group, SimpleCell, Div, Avatar, ButtonGroup, FormLayout, PopoutWrapper, ActionSheet, CellButton } from '@vkontakte/vkui';
import { Icon56MoneyCircleFillBlue } from '@vkontakte/icons';
import { Icon28BusOutline } from '@vkontakte/icons';
import { useState } from 'react';


const Keys = {
    payments: 'payments'
}


const Stats = ({go, fetchedUser}) => {
    const [payments, setPayments] = useState(null);
    bridge.send("VKWebAppStorageGet", {keys: ['payments']}).then((data) => {
        if(data.keys){
            setPayments(JSON.parse([...data.keys].filter(x => x.key == 'payments').map(x => x.value)));
        }
    });

    console.log(payments);

    return <Panel id="stats" centered={true}>
        <PanelHeader>История платежей</PanelHeader>
      <Header mode="secondary">Информация о платежах</Header>
      <SimpleCell>
      <InfoRow header="Дата рождения">30 января 1993</InfoRow>
      <InfoRow header="Дата рождения">{JSON.stringify(payments)}</InfoRow>
            </SimpleCell>
            <InfoRow header="Дата рождения">30 января 1993</InfoRow>
            <SimpleCell>
            <InfoRow header="Дата рождения">30 января 1993</InfoRow>
            </SimpleCell>
      <FixedLayout vertical='bottom'>
            <Div>
                <Button size='l' mode='outline' stretched='true' onClick={go} data-to='home'>Назад!</Button>
            </Div>
      </FixedLayout>
    </Panel>
}


export default Stats