import { Request, Response } from 'express';
import Users from '../../db/models/users';
import AuthService from '../auth.service';

export class AuthLocalController {
    loginUser(req: Request, res: Response) {
        let username = req.body["username"];
        let password = req.body["password"];
        Users.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return res.send({
                    success: 0
                })
            }
            if (user) {
                console.log("User Exists");
                if (!AuthService.validatePassword(user, password)) {
                    console.log("Incorrect Password");
                    res.send({
                        success: 0
                    });
                } else {
                    console.log("Valid Password");
                    let token = AuthService.getToken(user.id);
                    res.cookie("id", user._id)
                    res.cookie("username", user.username);
                    res.cookie("token", token, {httpOnly: true});
                    res.send({
                        success: 1
                    });
                }
            } else {
                console.log("User Doesn't exist");
                res.send({
                    success: 0
                });
            }
        })
    }

    registerUser(req: Request, res: Response) {
        let username = req.body["username"];
        let password = req.body["password"];
        console.log("Register", username, password);
        Users.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return res.send({
                    success: 0
                })
            }
            if (user) {
                console.log("User Exists");
                res.send({
                    success: 0
                });
            }
            else {
                let secrets = AuthService.genUser(username, password);
                let newuser = new Users(secrets);
                newuser.save()
                    .then(dbres => {
                        console.log("User Created", secrets.username, secrets._id);
                        let token = AuthService.getToken(secrets._id);
                        res.cookie("id", secrets._id)
                        res.cookie("username", secrets.username);
                        res.cookie("token", token, {httpOnly: true});
                        res.send({
                            success: 1
                        });
                    });
            }
        })
    }

    

    updateUsername(req: Request, res: Response) {
        let id = req.body["id"];
        let username = req.body["username"];
        Users.findOne({ username: username }, function (err, user) {
            if (err) {
                return res.send({
                    success: 0
                })
            }
            if (user) {
                console.log("username in use");
                res.send({
                    success: 0
                })
            } else {
                Users.findByIdAndUpdate(id, { username: username }, function (err, user) {
                    if (err) {
                        return res.send({
                            success: 0
                        })
                    }
                    let token = AuthService.getToken(user._id);
                    res.cookie("id", id)
                    res.cookie("username", username);
                    res.cookie("token", token, { httpOnly: true });
                    res.send({
                        success: 1
                    });
                })
            }
        });
    }
}

export default new AuthLocalController();