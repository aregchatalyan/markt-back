import React, { useRef, useState } from 'react';
import './controll.scss';

import Button from './button/Button';
import EnumDevices from './enum-devices/EnumDevices';
import { MediaTypes } from '../../constants/media-types';

const Control = ({ meet, user, setUser }) => {
  const audioSelRef = useRef(null);
  const videoSelRef = useRef(null);
  console.log(audioSelRef)
  const [ showDevices, setShowDevices ] = useState(false);
  const [ onOff, setOnOff ] = useState({ mic: false, cam: false, screen: false });

  const onExit = async () => {
    await meet.room.exit();

    await fetch('https://localhost:3030/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ user.accessToken }`
      }
    });

    setUser({});
  }

  const onShowDevices = () => {
    setShowDevices(!showDevices);
  }

  const onOffDevice = (device_name, type) => {
    setOnOff(prev => ({ ...prev, [device_name]: !prev[device_name] }));

    const device_id = (type === 'audio')
      ? audioSelRef.current.value
      : videoSelRef.current.value;

    !onOff[device_name]
      ? meet.room.produce(MediaTypes[type], device_id)
      : meet.room.closeProducer(MediaTypes[type]);
  }

  return (
    <div className="control">
      <Button
        colors={ { active: 'white', inactive: 'blue' } }
        icon={ 'sign-out-alt' }
        action={ onExit }/>

      <Button
        active={ showDevices }
        colors={ { active: 'white', inactive: 'blue' } }
        icon={ 'cogs' }
        action={ onShowDevices }/>

      <Button
        active={ onOff.mic }
        colors={ { active: 'white', inactive: 'blue' } }
        icon={ 'microphone' }
        action={ () => onOffDevice('mic', 'audio') }/>

      <Button
        active={ onOff.cam }
        colors={ { active: 'white', inactive: 'blue' } }
        icon={ 'camera' }
        action={ () => onOffDevice('cam', 'video') }/>

      <Button
        active={ onOff.screen }
        colors={ { active: 'white', inactive: 'blue' } }
        icon={ 'desktop' }
        action={ () => onOffDevice('screen', 'screen') }/>

      <EnumDevices { ...{ audioSelRef, videoSelRef } } style={ { display: showDevices ? 'block' : 'none' } }/>
    </div>
  );
}

export default Control;
