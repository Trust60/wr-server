export const addPrevValues = (log, prevLog = null) => {
	return log.sets.map((set, index) => ({
		...set,
		prevWeight: prevLog ? prevLog.sets[index].weight : 0,
		prevRepeat: prevLog ? prevLog.sets[index].repeat : 0
	}))
}
