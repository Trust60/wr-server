import asyncHandler from 'express-async-handler'
import { prisma } from '../../prisma.js'

// @desc    Create new workout log
// @route   POST /api/workouts/log/:id
// @access  Private
export const createNewWorkoutLog = asyncHandler(async (req, res) => {
	const workoutId = Number(req.params.id)

	const workout = await prisma.workout.findUnique({
		where: { id: workoutId },
		include: { exercises: true }
	})

	if (!workout) {
		res.status(404)
		throw new Error('Exercise not found')
	}

	const workoutLog = await prisma.workoutLog.create({
		data: {
			user: {
				connect: {
					id: req.user.id
				}
			},
			workout: {
				connect: {
					id: workoutId
				}
			},
			exerciseLogs: {
				create: workout.exercises.map(exercise => ({
					user: {
						connect: {
							id: req.user.id
						}
					},
					exercise: {
						connect: {
							id: exercise.id
						}
					},
					sets: {
						create: Array.from({ length: exercise.sets }, () => ({
							weight: 0,
							repeat: 0
						}))
					}
				}))
			}
		},
		include: {
			exerciseLogs: {
				include: {
					sets: true
				}
			}
		}
	})
	res.json(workoutLog)
})