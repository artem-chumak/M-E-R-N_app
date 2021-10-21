import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const { loading, error, request, clearError } = useHttp()
  const [form, setForm] = useState({ email: '', password: '' })

  // обновление текстовых инпутов
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  const loginHandler = async () => {
    try {
      const data = await request('api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Reduce link</h1>
        <div className="card blue-grey darken-1">
        <div className="card-content white-text">
          <span className="card-title">Authorization</span>
          <div>
            <div className="input-field">
              <input
              placeholder="text your email"
              id="email"
              type="text"
              className="validate"
              name="email"
              value={form.email}
              onChange={changeHandler}
              />
              <label htmlFor="email">email</label>
            </div>
            <div className="input-field">
              <input
              placeholder="text password"
              id="password"
              type="password"
              className="validate"
              name="password"
              value={form.password}
              onChange={changeHandler}
              />
              <label htmlFor="password">password</label>
            </div>
          </div>
        </div>
        <div className="card-action">
          <button
          className="btn yellow darken-4"
          style={{marginRight: 20}}
          disabled={loading}
          onClick={loginHandler}
          >
            Entre
          </button>
          <button
          className="btn grey lighten-1 black-text"
          onClick={registerHandler}
          disabled={loading}
          >
            Registration
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}