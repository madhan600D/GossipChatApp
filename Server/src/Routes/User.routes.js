import express from 'express'
import { Login , Signup , Logout, UpdateProfile , ValidateUser,LastUsedTheme , UpdateLastUsedTheme } from '../Controller/User.controller.js'
import { ValidateRoute } from '../MiddleWare/ValidateRoute.js';

const UserRouter = express.Router();

UserRouter.put('/signup',Signup) ;

UserRouter.put('/login', Login)

UserRouter.put('/logout' , Logout)

UserRouter.patch('/update-profile' , ValidateRoute , UpdateProfile)

UserRouter.get('/validate-user',ValidateRoute , ValidateUser)

UserRouter.get('/get-theme' , LastUsedTheme)

UserRouter.post('/update-theme' , UpdateLastUsedTheme)

export default UserRouter