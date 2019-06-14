const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//model
require('../models/login')
const Login = mongoose.model('login')

module.exports = function (passport) {

  passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) => {
    Login.findOne({email: email}).then((login)=>{
      if(!login){
        return done(null, false, {message: "Email não cadastrado"})
      }

      bcrypt.compare(senha, login.senha, (erro, batem) => {

        if(batem){
          return done(null, login)
        } else{
          return done(null, false, {message: "Senha incorreta"})
        }
      })
    })
  }))

  passport.serializeUser((login, done)=>{
    done(null, login.id)
  })

  passport.deserializeUser((id, done)=>{
    Login.findById(id, (err, login)=>{
      done(err, login)
    })
  })
}
