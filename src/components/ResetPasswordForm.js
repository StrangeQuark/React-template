// Integration file: Email

import React from "react";
import "./css/ResetPassword.css";

export default class ResetPasswordSearchForm extends React.Component {
    async componentDidMount() {
        //Since we are using a button outside of the form to handle the login attempt
        //let's listen to the password input field for if the user
        //presses the enter key, and if so we can simulate a button click
        var passwordInput = document.getElementById('password')

        passwordInput.addEventListener('keyup', function onEvent(e) {
            if(e.code === "Enter") {
                document.getElementById('submit-button').click()
            }
        })

        //Change the size of some elements to be proportional to the screen
        var requestForm = document.getElementById('request-form')
        var requestSuccessTextField = document.getElementById('request-success-text-field')

        requestForm.style.width = (window.innerWidth / 8) + "px";
        requestForm.style.height = (window.innerHeight / 4) + "px";
        requestSuccessTextField.style.width = (window.innerWidth / 6) + "px";

        //Move the request-div to the center of the screen once the width and height have been rendered
        var requestDiv = document.getElementById('request-div')

        requestDiv.style.marginTop = "-" + requestDiv.offsetHeight / 2 + "px"
        requestDiv.style.marginLeft = "-" + requestDiv.offsetWidth / 2 + "px"
    }

    render() {
        function requestHandler() {
            //Get the search params
            const query = window.location.search
            const urlParameters = new URLSearchParams(query)
            const token = urlParameters.get('token')

            var nonMatchingPasswordMessage = document.getElementById('nonmatching-password-message')
            var noPasswordMessage = document.getElementById('no-password-message')
            var tokenAlreadyConfirmedMessage = document.getElementById('token-already-confirmed')
            var tokenNotFound = document.getElementById('token-not-found')
            var password = window.document.getElementById('password').value
            var confirmationPassword = window.document.getElementById('confirm-password').value
            var request = {"token": token, "password": password}

            //Reset when user attempts login
            nonMatchingPasswordMessage.hidden = true
            noPasswordMessage.hidden = true
            tokenAlreadyConfirmedMessage.hidden = true
            tokenNotFound.hidden = true


            //If the user enters nothing, do nothing
            if(password === "") {
                noPasswordMessage.hidden = false
                return
            }
            //If the passwords do not match, show the error message
            if(password !== confirmationPassword) {
                nonMatchingPasswordMessage.hidden = false
                return
            }

            fetch('http://localhost:6005/email/confirmToken?token=' + token, {
                method: 'GET',
                }).then(response => response.json().then(
                    () => {
                        if(response.status === 404) {
                            //TODO token not found, token doesn't exist
                            tokenNotFound.hidden = false
                            return
                        }
                        if(response.status === 409) {
                            tokenAlreadyConfirmedMessage.hidden = false
                            return
                        }
                        
                        // Call fetch to auth service for updating the user's password
                        // fetch()
                        var requestSuccessDiv = document.getElementById('request-success-div')
                        document.getElementById('request-success-text-field').innerHTML = "Your password has been reset. Click <a href='/login'>here</a> to login"
                        document.getElementById('request-div').hidden = true
                        requestSuccessDiv.hidden = false

                        //Move the request-success-div to the center of the screen once the width and height have been rendered
                        requestSuccessDiv.style.marginTop = "-" + requestSuccessDiv.offsetHeight / 2 + "px"
                        requestSuccessDiv.style.marginLeft = "-" + requestSuccessDiv.offsetWidth / 2 + "px"
                    }
                ))
        }

        return(
            <>
            <div id="request-div" className="request-div">
                <h1 style={{color: "white"}}>New password</h1>
                <div id="nonmatching-password-message-div" style={{height: "100px"}} >
                    <b id="nonmatching-password-message" hidden={true} style={{color: "red"}}>Your passwords do not match</b>
                    <b id="no-password-message" hidden={true} style={{color: "red"}}>You must enter a password</b>
                    <b id="token-already-confirmed" hidden={true} style={{color: "red"}}>This token has already been confirmed</b>
                    <b id="token-not-found" hidden={true} style={{color: "red"}}>Token not found</b>
                </div>
                <form id="request-form" className="request-form">
                    <label htmlFor="password">New password:</label><br />
                    <div style={{height: "20px"}} />
                    <input type="password" id="password" name="password" placeholder="Type your password"/><hr />
                    <div style={{height: "20px"}} />

                    <label htmlFor="confirm-password">Confirm password:</label><br />
                    <div style={{height: "20px"}} />
                    <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password"/><hr />
                </form>
                <button className="submit-button" id='submit-button' onClick={() => requestHandler()}>SUBMIT</button>
            </div>
            <div id="request-success-div" className="request-div" hidden={true}>
                <p id="request-success-text-field"></p>
            </div>
            </>
        )
    }
}