const express = require("express");
const { trainEnquiryByTrainNumber } = require("./services/trainEnquiryByTrainNumber");
const { fetchTrainCompositionByTrainNumber } = require("./services/trainCompositionByTrainNumber");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server running");
});

app.get("/data", async (req, res) => {
    try {
        // train number, jDate from query parameters
        const trainNumber = req.query.trainNumber;
        const jDate = req.query.jDate;

        console.log(`Received request for train ${trainNumber} on date ${jDate}`);

        // const response = await fetch("https://api.example.com/users");

        // const data = await response.json();

        // // basic processing
        // const result = {
        //     totalUsers: data.length,
        //     success: true
        // };

        // res.json(result);

        // const trainEnquireyResponse = await fetch(`https://www.irctc.co.in/eticketing/protected/mapps1/trnscheduleenquiry/${trainNumber}`, {
        //     headers: {
        //         "accept": "application/json, text/plain, */*",
        //         "accept-language": "en-US,en;q=0.9",
        //         "greq": Date.now().toString(),
        //         //"Cookie": "TS018d84e5=01d83d9ce7d1731b049a7fe68263f53828633114d2972553f91f5b6c444c751f18f047eb03687ee525bb2daeeca08b8f980247d825; _abck=B71E872ACB2D409C6DB6595DCFC00431~-1~YAAQ4qIauFW0+iGeAQAAU1NeXQ/jAv4ymBDy1HRCGElLlvzRAWlxpNWxCG0VoAvz2Z8I/WzdFEXeo5VqueYtzXqmwDM7LLrjplAS45hI7UHd0IqQ+TMsVhDdg0jufuV0ZhrM6cQjbjO6vIXSo9hIw8hPDrPS2UcMYcFLppjdUDp6Wr1p6kWDrGWFhTvuOLLK/AdLnb2HsOt+yFzZUmydNJsDEO2fbuhjt8aIhkMj/B9y9Li48p8aJmhwLIJ0iuxvp09vsmfJqNu3Rvh2x/vaCHdxrL/fqHGjy/RJCWvJilvjILCyQddwxEvO5F8f54oj/9iOYw/mlijJIrZfkc0qyu7Br+aqSu8t5b/0JkHmDBo666dl5WrS4ccL+EF8nmtrS+6g5o/Jpv6tgvo3QCGJDN4g6L4A3dJxe8fMzz5cI3O5hZZHNcW3WFVLo0zPS/uj~-1~-1~-1~-1~-1; bm_sz=22487822B01C4175379C161AE34B1285~YAAQRAHARbNwbD6eAQAAfCv0XB+guTLsSH4Kv7RBYwnZ0wnN9/NwsgYNbUlpRHeVMVSUFHm2QrrdoRV3EV1ckXpAoZSAa95BxwTEQNNFxSFmVJtXPHhXtrNERGzAKxhuM4uamCvKoPI3j1U372K4+Ah0P48eQXkvMzRL+tzd7pZP2LIjpTJHM/Q5+69ieh+DvvyN+M/f8OpxlwZul+FRoD0LnNH+6uIopIJ8FOsa0Uo3sHHsRgyPgMd/mJMXUeG70eKhz1fBjNAzZ6ay2Uwxz1oqpzIy4Bn4Bm5HxvOTc3jh1AaMN27bnbAgu1xX78+P8gQzlUHcZnd+AQYw20VZwZePSzlRCTj+ewotpPepvC9nfCk="
        //     }
        // });

        // const trainEnquireyData = await trainEnquireyResponse.json();

        // // print train enquiry data to console
        // console.log("Train Enquiry Data:", trainEnquireyData);

        const trainEnquiryResult = await trainEnquiryByTrainNumber(trainNumber);

        // log train enquiry result to console
        console.log("Train Enquiry Result:", trainEnquiryResult);
        // make a array of pairs of station code and station name from trainEnquiryResult into an array of objects with code and name as keys
        

        const stationCodeNamePairs = trainEnquiryResult.stationList.map(station => {
            return {
                code: station.stationCode,
                name: station.stationName
            }
        });

        // log station code name pairs to console
        console.log("Station Code Name Pairs:", stationCodeNamePairs);

        const boardingStationCode = stationCodeNamePairs[0].code;

        const trainCompositionData = await fetchTrainCompositionByTrainNumber(trainNumber, jDate, boardingStationCode);

        // log train composition data to console
        console.log("Train Composition Data:", trainCompositionData);

        // store coachName and classCode from train composition data into an array of objects with coachName and classCode as keys
        const coachClassPairs = trainCompositionData.cdd.map(coach => {
            return {
                coachName: coach.coachName,
                classCode: coach.classCode
            }
        });

        // log coach class pairs to console
        console.log("Coach Class Pairs:", coachClassPairs);

        res.json({
            trainEnquiryResult,
            stationCodeNamePairs,
            boardingStationCode,
            trainCompositionData,
            coachClassPairs
        });


    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});