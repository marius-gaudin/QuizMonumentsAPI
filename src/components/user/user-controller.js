import User from './user-model.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register (ctx) {
    try {
        const registerValidationSchema = Joi.object({
            email: Joi.string().email().required(),
            pseudo: Joi.string().required(),
            password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('password'))
        })

        const { error, value } = registerValidationSchema.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        let user = await User.findOne({email: value.email})
        if(user !== null) return ctx.badRequest({message: `L'email existe déja`})
        user = await User.findOne({pseudo: value.pseudo})
        if(user !== null) return ctx.badRequest({message: `Ce pseudo existe déja`})
        value.password = await bcrypt.hash(value.password, 10);
        const newUser = await User.create(value);
        ctx.ok(newUser);
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function login(ctx) {
    try {
        const loginValidationSchema = Joi.object({
            login: Joi.string().required(),
            password: Joi.string().required()
        })

        const { error, value } = loginValidationSchema.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const user = await User.findOne({$or: [
            {email: value.login}, 
            {pseudo: value.login}
        ]})

        if(user === null || !(await bcrypt.compare(value.password, user.password))) {
            ctx.status = 401
            return ctx.body = { message: 'Mot de passe ou identifiant incorrect'}
        }
        const userInfo = {'_id': user._id, 'email': user.email, 'pseudo': user.pseudo}
        const token = jwt.sign({ data:userInfo }, process.env.JWT_SECRET, { expiresIn: '3h' })
        userInfo.token = token
        return ctx.ok(userInfo)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}