import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { calculateMinutes } from './calculate-minutes.js'

// @desc    Get workouts
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})

	res.json(workouts)
})

// @desc    Get workout
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.findUnique({
			where: { id: +req.params.id },
			include: {
				exercises: true
			}
		})

		const minutes = calculateMinutes(workout.exercises.length)

		res.json({ ...workout, minutes })
	} catch {
		res.status(404)
		throw new Error('Workout not found')
	}
})

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: Number(id) }))
			}
		}
	})
	res.json(workout)
})

// @desc    Update new workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body
	try {
		const workout = await prisma.workout.update({
			where: {
				id: Number(req.params.id)
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: Number(id) }))
				}
			}
		})
		res.json(workout)
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found')
	}
})

// @desc    Delete new workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.delete({
			where: {
				id: Number(req.params.id)
			}
		})
		res.json({ message: 'Workout successfully deleted!' })
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found')
	}
})
