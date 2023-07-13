import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desc    Create new exerciseLog
// @route   POST /api/exercises/log/:exerciseId
// @access  Private
export const createNewExerciseLog = asyncHandler(async (req, res) => {
	const exerciseId = +req.params.id

	const exercise = await prisma.exercise.findUnique({
		where: {
			id: exerciseId
		}
	})

	if (!exercise) {
		res.status(404)
		throw new Error('Exercise not found!')
	}

	let setsDefault = []

	for (let i = 0; i < exercise.sets; i++) {
		setsDefault.push({
			weight: 0,
			repeat: 0
		})
	}

	const exerciseLog = await prisma.exerciseLog.create({
		data: {
			user: {
				connect: {
					id: req.user.id
				}
			},
			exercise: {
				connect: {
					id: exerciseId
				}
			},
			sets: {
				createMany: {
					data: setsDefault
				}
			}
		},
		include: {
			sets: true
		}
	})

	res.json(exerciseLog)
})
