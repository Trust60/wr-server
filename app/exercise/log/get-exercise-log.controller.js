import { prisma } from '../../prisma.js'

// @desc    Get exerciseLog
// @route   GET /api/exercises/log/:id
// @access  Private
export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: { id: Number(req.params.id) },
		include: { exercise: true }
	})
	if (!exerciseLog) {
		res.status(404)
		throw new Error('Exercise Log not found')
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: Number(req.user.id),
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
})
