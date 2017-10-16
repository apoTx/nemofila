function getAdStatusText(statusCode) {
	let statusText;
	if (statusCode === 0)
		statusText = 'Waiting';
	else if (statusCode === 1)
		statusText = 'Approved';
	else if (statusCode === 2)
		statusText = 'Rejected';
	else if (statusCode === 3)
		statusText = 'Time Ending';
	else if (statusCode === 4)
		statusText = 'Unpublished';
	else
		statusText = 'Another';

	return statusText;
}

module.exports = getAdStatusText;
