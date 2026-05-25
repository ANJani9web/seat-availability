async function trainEnquiryByTrainNumber(trainNumber) {
    const trainEnquireyResponse = await fetch(`https://www.irctc.co.in/eticketing/protected/mapps1/trnscheduleenquiry/${trainNumber}`, {
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "greq": Date.now().toString(),
        }
    });

    const trainEnquireyData = await trainEnquireyResponse.json();

    // print train enquiry data to console
    console.log("Train Enquiry Data:", trainEnquireyData);

    return trainEnquireyData;
}

module.exports = {
    trainEnquiryByTrainNumber
}