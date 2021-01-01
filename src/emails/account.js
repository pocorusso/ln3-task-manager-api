const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// sgMail.send({
//     to: 'mochipoo@gmail.com',
//     from: 'mochipoojunk@gmail.com',
//     subject: 'hi hih hihi',
//     text: 'i hope this works'
// }).then(() => {
//     console.log('Email sent')
// }).catch((error) => {
//     console.error(error)
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mochipoojunk@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}. let me know how you get along with the app.`
    }).then(() => {
        console.log('Email sent')
    }).catch((error) => {
        console.error(error)
    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mochipoojunk@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Sorry to see you go, ${name}.`
    }).then(() => {
        console.log('Email sent')
    }).catch((error) => {
        console.error(error)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}