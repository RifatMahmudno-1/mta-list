import nodemailer from 'nodemailer'

export default async opts => {
	if (!opts || !opts.to || !opts.subject || (!opts.text && !opts.html)) throw 'Required options not provided. [sendMail]'
	const account = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EmailAddress,
			pass: process.env.EmailPass
		}
	})
	await account.sendMail({ from: `MTA List <${process.env.EmailAddress}>`, ...opts })
}
