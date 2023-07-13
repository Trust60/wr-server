export const addPrevValues = (log, prevLog = null) => {
	return log.sets.map((item, index) => ({
		...item,
		prevWeight: prevLog ? prevLog.sets[index].weight : 0,
		prevRepeat: prevLog ? prevLog.sets[index].repeat : 0
	}))
}
