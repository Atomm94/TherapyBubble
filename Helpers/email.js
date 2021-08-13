import mailer from 'nodemailer';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
import smsCode from 'generate-sms-verification-code';
import * as config from '../config';

const oauth2Client = new OAuth2("993202546190-v8qjss1vn59e52s0o9dmr3kqph1rbnmb.apps.googleusercontent.com", "993202546190-v8qjss1vn59e52s0o9dmr3kqph1rbnmb.apps.googleusercontent.com", "https://developers.google.com/oauthplayground");

oauth2Client.setCredentials({ refresh_token: "1//04Ii4ijHLJA9uCgYIARAAGAQSNwF-L9Ir20xpjbLxi4iiDXe80-lFnVOrtq2l4WhBRGKJas1H5Lyt7dUlhjIuOvcyUKj_Z1xoXAQ" });


const send_mail = mailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        user: "ilovecoding777@gmail.com",
        clientId: "993202546190-v8qjss1vn59e52s0o9dmr3kqph1rbnmb.apps.googleusercontent.com",
        clientSecret: "xaGswMU2EJFOy7h1VByOubUE",
        refreshToken: "1//04Ii4ijHLJA9uCgYIARAAGAQSNwF-L9Ir20xpjbLxi4iiDXe80-lFnVOrtq2l4WhBRGKJas1H5Lyt7dUlhjIuOvcyUKj_Z1xoXAQ",
        access_type:"offline",
        grantType:"authorization_code",
        accessToken: oauth2Client.getAccessTokenAsync
    }
});


const send = async (to, type) => {
    const generatedCode = smsCode(6, {type: 'string'})
    new Promise((res, rej) => {
        send_mail.sendMail({
            from: "ilovecoding777@gmail.com",
            to: to,
            html:
                '<div>' +
                '<div style="text-align: center; font-size:1.2rem">Hi dear user</div>' +
                '<div style="text-align: center; font-size:1.2rem; margin-top:10px">Your confirmation code</div>' +
                '<div style="text-align: center; font-size:1.5rem;color: #ff0000; margin-top:10px">' + generatedCode + '</div>' +
                '</div>',
            subject: 'Email Verification',
            generateTextFromHTML: false
        }, function (err, info) {
            if (err) {
                console.log(err);
                res(false);
            }
            if (info) {
                send_mail.close();
                res(true);
            }
        })
    })
    return generatedCode;
}


export default send;


