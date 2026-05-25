async function trainEnquiryByTrainNumber(trainNumber) {
    console.log(`Fetching train enquiry data for train number ${trainNumber}...`);
    const trainEnquireyResponse = await fetch(`https://www.irctc.co.in/eticketing/protected/mapps1/trnscheduleenquiry/${trainNumber}`, {
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "greq": Date.now().toString(),
        }
    });

    console.log(`Received response for train enquiry of train number ${trainNumber} with status ${trainEnquireyResponse.status}`);

    if (!trainEnquireyResponse.ok) {
        throw new Error(`Failed to fetch train enquiry data for train number ${trainNumber}: ${trainEnquireyResponse.statusText}`);
    }

    const trainEnquireyData = await trainEnquireyResponse.json();

    // print train enquiry data to console
    console.log("Train Enquiry Data:", trainEnquireyData);

    return trainEnquireyData;
}

module.exports = {
    trainEnquiryByTrainNumber
}