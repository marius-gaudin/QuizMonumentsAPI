import User from '#components/user/user-model.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register (ctx) {
    try {
        const registerValidationSchema = Joi.object({
            email: Joi.string().required(),
            pseudo: Joi.string().required(),
            password: Joi.string().required()
        })

        const { error, value } = registerValidationSchema.validate(ctx.request.body)
        if(error) throw new Error(error)
        value.password = await bcrypt.hash(value.password, 5);
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
        if(error) throw new Error(error)
        const user = await User.findOne({$or: [
            {email: value.login}, 
            {pseudo: value.login}
        ]}).exec();

        if(!user) {
            ctx.badRequest({ message: 'Identifiants incorrect'})
        } else if(await bcrypt.compare(value.password, user.password)) {
            const token = jwt.sign({ data:user }, process.env.JWT_SECRET);
            ctx.ok({token, user});
        } else {
            ctx.badRequest({ message: 'Erreur'});
        }
        
    } catch(e) {
        ctx.badRequest({ message: e.message });
    }
}