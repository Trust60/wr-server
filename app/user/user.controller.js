import asyncHandler from 'express-async-handler'
import { UserFields } from '../utils/user.utils.js'
import { prisma } from '../prisma.js'

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserFields
	})

	const countExerciseSetsCompleted = await prisma.exerciseLog.count({
		where: {
			userId: req.user.id,
			isCompleted: true
		}
	})

	const workouts = await prisma.workoutLog.count({
		where: {
			userId: req.user.id,
			isCompleted: true
		}
	})

	const kgs = await prisma.exerciseSet.aggregate({
		where: {
			exerciseLog: {
				userId: req.user.id
			},
			isCompleted: true
		},
		_sum: {
			weight: true
		}
	})

	res.json({
		...user,
		statistics: [
			{
				label: 'Minutes',
				value: Math.ceil(countExerciseSetsCompleted * 4.1) || 0
			},
			{
				label: 'Workouts',
				value: workouts || 0
			},
			{
				label: 'Kgs',
				value: kgs._sum.weight || 0
			}
		]
	})
})
