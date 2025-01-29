// Integration file: Auth

import React, { useState } from "react"
import { FaRegCircleXmark } from "react-icons/fa6"
import { FaCheckCircle } from "react-icons/fa"
import EmailUtility from "../utility/EmailUtility"
import "./css/UserRegisterForm.css"


const UserRegisterForm = () => {
  const[username, setUsername] = useState('')
  const[isUsernameValid, setIsUsernameValid] = useState(true)

  const[email, setEmail] = useState('')
  const[isEmailValid, setIsEmailValid] = useState(true)

  const[password, setPassword] = useState('')
  const[isPasswordValid, setIsPasswordValid] = useState(true)

  const[confirmPassword, setConfirmPassword] = useState('')
  const[isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)

  const[isSubmitted, setIsSubmitted] = useState(false)
  const[isSuccess, setIsSuccess] = useState(false)

  const[usernameErrorMessage, setUsernameErrorMessage] = useState("")
  const[emailErrorMessage, setEmailErrorMessage] = useState("")
  const[passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const[confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("")

  function registrationHandler() {
    setIsSubmitted(true)

    setIsUsernameValid(username !== '')
    setUsernameErrorMessage(username !== '' ? "" : "Username must not be blank")

    setIsEmailValid(email !== ''  && EmailUtility.verifyEmailRegex(email))
    setEmailErrorMessage(email !== '' ? "" : "Email must not be blank")
    setEmailErrorMessage(EmailUtility.verifyEmailRegex(email) ? "" : "Not a valid email")

    setIsPasswordValid(password !== '')
    setPasswordErrorMessage(password !== '' ? "" : "Password must not be blank")

    setIsConfirmPasswordValid(confirmPassword !== '' && confirmPassword === password)
    setConfirmPasswordErrorMessage(confirmPassword !== '' ? "" : "Confirmation password must not be blank")
    setConfirmPasswordErrorMessage(confirmPassword === password ? "" : "Passwords must match")

    const isFormValid =
      username !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      confirmPassword === password &&
      EmailUtility.verifyEmailRegex(email)

    if (!isFormValid)
      return

    var registerJSON = {"username": username, "password": password, "email": email}

    fetch('http://localhost:6001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerJSON),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 409) {
            const data = await response.json().catch(() => ({}))
            if (data.errorCode === 410) {
              setIsUsernameValid(false)
              setUsernameErrorMessage("Username is already taken")
            } else if (data.errorCode === 401) {
              setIsEmailValid(false)
              setEmailErrorMessage("Email is already taken")
            }
          }
        } else {
          const data = await response.json()
          setIsSuccess(true)
        }
      })
      .catch((error) => {
        console.error('Network error or unexpected issue:', error)
      })
    
  }

  return(
    <>
      {!isSuccess && (<div id="register-div" className="auth-div">
        <h1>Create account</h1>

        <form id="register-form" className="register-form">
          <label htmlFor="username">Username:</label>
          <div>
            {isSubmitted && (isUsernameValid ? <FaCheckCircle className="check-circle" /> : <FaRegCircleXmark title={usernameErrorMessage} className="circle-x-mark" />)}
            <input type="text" id="username" name="username" placeholder="Type your username" spellCheck="false" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <hr />

          <label htmlFor="email">Email:</label>
          <div>
            {isSubmitted && (isEmailValid ? <FaCheckCircle className="check-circle" /> : <FaRegCircleXmark title={emailErrorMessage} className="circle-x-mark" />)}
            <input type="text" id="email" name="email" placeholder="Type your email" spellCheck="false" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <hr />

          <label htmlFor="password">Password:</label>
          <div>
            {isSubmitted && (isPasswordValid ? <FaCheckCircle className="check-circle" /> : <FaRegCircleXmark title={passwordErrorMessage} className="circle-x-mark" />)}
            <input type="password" id="password" name="password" placeholder="Type your password" spellCheck="false" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <hr />

          <label htmlFor="confirm-password">Confirm password:</label>
          <div>
            {isSubmitted && (isConfirmPasswordValid ? <FaCheckCircle className="check-circle" /> : <FaRegCircleXmark title={confirmPasswordErrorMessage} className="circle-x-mark" />)}
            <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" spellCheck="false" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <hr />
        </form>

        <button id='submit-button' onClick={() => registrationHandler()}>SIGN UP</button>
      </div>)}

      {isSuccess && (<div id="request-success-div" className="auth-div">
        <p id="request-success-text-field">
          Thank you for signing up! An email has been sent to {email} with a confirmation link to activate your account.
        </p>
        <p>
          <a href="/login">Click here</a> to return to the login page.
        </p>
      </div>)}
    </>
  )
}

export default UserRegisterForm
