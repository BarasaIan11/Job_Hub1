import express from 'express'
import { applyForJob, createUser, getUserData, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'


const router = express.Router()

// get user data
router.get('/user', getUserData)

// apply for a job
router.post('/apply',applyForJob)

// creating a new user
router.post('/create-user', createUser)

// get applied jobs data
router.get('/applications', getUserData)

// update user profile
router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router