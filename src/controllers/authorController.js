const authorModel = require('../models/authorModel');
const jwt = require("jsonwebtoken")
const validator = require('../util/validator')
const passwordRegex = /^.(?=.{6,})(?=.[a-zA-Z])(?=.\d)(?=.[!&$%&? "]).*$/
const regexEmail=  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,3})$/i


    // -----Create Author---------------------------------------------------------------------------------------------------------------
const createAuthor = async function (req, res) {
    try {
        let { fname, lname, title, email, password } = req.body;
        if(!Object.keys(req.body).length > 0){
            return res.status(400).send({status: false, msg : "Provide Details"})
        }
        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is required" })};

    if(typeof fname !== "string" || fname.trim().length === 0){
        return res.status(400).send({status: false, msg: "Enter valid name"})
    }
        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is required" })};

            if(typeof fname !== "string" || fname.trim().length === 0){
                return res.status(400).send({status: false, msg: "Enter valid name"})
            }

        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" })};

        if(!["Mr", "Mrs", "Miss"].includes(title)){
            return res.status(400).send({ status: false, msg: "title is not valid" })}

        if (!email) {
            return res.status(400).send({ status: false, msg: "email is required" })};

        if(!email.match(regexEmail)){
            return res.status(400).send({status: false, msg: "Invalid email"})};

        let validEmail= await authorModel.findOne({email})
        if(validEmail){
            return res.status(400).send({status: false, msg: "email is already exist"})};

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })};

        // if (!password.match(passwordRegex)) {
        //     return res.status(400).send({ status: false, msg: "password is not strong" })};

        let savedData= await authorModel.create(req.body)
        return res.status(201).send({status: true, data: savedData})

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

    // ------login Author-----------------------------------------------------------------------------------------------------------------
const loginAuthor = async function(req, res){

    try  { 
       const { email, password } = req.body
   
       if(!Object.keys(req.body).length > 0){
            return res.status(400).send({status: false, msg: "Please provide details for login"})};

        if(!email){
            return res.status(400).send({status: false, msg: "Provide email"})};
        if(!email.match(regexEmail)){
            return res.status(400).send({status: false, msg: "Invalid email"})};

       if(!password){
        return res.status(400).send({status: false, msg: "Provide password"})};

        // if (!password.match(passwordRegex)) {
        //     return res.status(400).send({ status: false, msg: "password is required" })};

    let savedData = await authorModel.findOne({ email, password })
    if(!savedData){
       return res.status(404).send({status: false, msg: "No such data"}) };

   //--------create token ----------------------------------------------------------------------------------------------------------------
    let encodeToken = jwt.sign({userId: savedData._id}, "group7")
      return res.status(200).send({status: true, data: encodeToken})
    }catch(error){
       return res.status(500).send({status: false, msg: error.message})
   }
}

module.exports={createAuthor,loginAuthor};


