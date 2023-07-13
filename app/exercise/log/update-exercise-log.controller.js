import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desc    Update exercise log set
// @route   PUT /api/exercises/log/set/:id
// @access  Private
export const updateExerciseLogSet = asyncHandler(async (req, res) => {
	const { weight, repeat, isCompleted } = req.body

	try {
		const exerciseLogSet = await prisma.exerciseSet.update({
			where: {
				id: +req.params.id
			},
			data: {
				weight,
				repeat,
				isCompleted
			}
		})

		res.json(exerciseLogSet)
	} catch (error) {
		res.status(404)
		throw new Error('Exercise log set not found!')
	}
})

// @desc    Update status of complete exercise log
// @route   PATCH /api/exercises/log/complete/:id
// @access  Private
export const completeExerciseLog = asyncHandler(async (req, res) => {
	const { isCompleted } = req.body

	try {
		const exerciseLog = await prisma.exerciseLog.update({
			where: {
				id: +req.params.id
			},
			data: {
				isCompleted
			},
			include: { exercise: true, workoutLog: true }
		})

		res.json(exerciseLog)
	} catch (error) {
		res.status(404)
		throw new Error('Exercise log not found!')
	}
})
