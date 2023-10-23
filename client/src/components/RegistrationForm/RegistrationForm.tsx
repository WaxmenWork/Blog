import React, { useContext, useState } from 'react'
import { Context } from '../../index';
import styles from './RegistrationForm.module.scss'
import { observer } from 'mobx-react-lite';

const RegistrationForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);

    return (
        <div className={styles.registrationForm}>
            <h1>Регистрация</h1>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Пароль'
            />
            <button onClick={() => store.registration(email, password)} >Зарегистрироваться</button>
        </div>
    )
}

export default observer(RegistrationForm);