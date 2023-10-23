import React, { useContext, useState } from 'react'
import { Context } from '../../index';
import styles from './LoginForm.module.scss';
import { observer } from 'mobx-react-lite';

const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context)

    return (
        <div className={styles.loginForm}>
            <h1>Авторизация</h1>
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
            <button onClick={() => store.login(email, password)} >Войти</button>
        </div>
    )
}

export default observer(LoginForm);