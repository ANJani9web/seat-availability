const express = require("express");
const { trainEnquiryByTrainNumber } = require("./services/trainEnquiryByTrainNumber");
const { fetchTrainCompositionByTrainNumber } = require("./services/trainCompositionByTrainNumber");
const { coachCompositionByTrainNumber } = require("./services/coachComposition");
const { getOccupancyData } = require("./services/occupancyHelper");

// const app = express();

// //app.use(express.static("public"));
// app.use(express.json());

// // app.get("/", (req, res) => {
// //     res.send("Server running");
// // });

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/data", async (req, res) => {
    try {
        // train number, jDate from query parameters
        const trainNumber = req.query.trainNumber;
        const jDate = req.query.jDate;
        const toStationCode = req.query.toStationCode;
        const fromStationCode = req.query.fromStationCode;

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

        // for coachClass let us call coach composition file by looping over coachClassPairs array and passing coachName and classCode as parameters to get coach composition data for each coach and store it in an array of objects with coachName, classCode and coachCompositionData as keys
        const coachCompositionDataArray = [];

        // I also want to these data in html table format and send it as response to client but before that let us log the occupancy data for each coach and class to console
        // "occupancyData": [
        //     {
        //         "berthCode": "U",
        //             "berthNo": 27,
        //                 "from": "PNBE",
        //                     "to": "BSB",
        //                         "quota": "GN",
        //                             "occupancy": false,
        //                                 "coachName": "B5",
        //                                     "coachCode": "3A"
        //     },
        //     {
        //         "berthCode": "L",
        //             "berthNo": 41,
        //                 "from": "PNBE",
        //                     "to": "BSB",
        //                         "quota": "GN",
        //                             "occupancy": false,
        //                                 "coachName": "B5",
        //                                     "coachCode": "3A"
        //     },
        //     {
        //         "berthCode": "L",
        //             "berthNo": 44,
        //                 "from": "PNBE",
        //                     "to": "AYC",
        //                         "quota": "GN",
        //                             "occupancy": false,
        //                                 "coachName": "B5",
        //                                     "coachCode": "3A"
        //     },
        //     {
        //         "berthCode": "L",
        //             "berthNo": 49,
        //                 "from": "PNBE",
        //                     "to": "BSB",
        //                         "quota": "GN",
        //                             "occupancy": false,
        //                                 "coachName": "B5",
        //                                     "coachCode": "3A"
        //     },
        //     {
        //         "berthCode": "L",
        //             "berthNo": 52,
        //                 "from": "PNBE",
        //                     "to": "BSB",
        //                         "quota": "GN",
        //                             "occupancy": false,
        //                                 "coachName": "B5",
        //                                     "coachCode": "3A"
        //     }
        //   ]

        const occupancyDataArray = [];
        for (const coachClassPair of coachClassPairs) {
            const coachCompositionData = await coachCompositionByTrainNumber(trainNumber, boardingStationCode, jDate, coachClassPair.coachName, coachClassPair.classCode);
            const occupancyData = getOccupancyData(coachCompositionData, stationCodeNamePairs, fromStationCode, toStationCode, coachClassPair.coachName, coachClassPair.classCode);
            console.log(`Occupancy Data for coach ${coachClassPair.coachName} and class ${coachClassPair.classCode}:`, occupancyData);
            coachCompositionDataArray.push({
                coachName: coachClassPair.coachName,
                classCode: coachClassPair.classCode,
                coachCompositionData: coachCompositionData,
                occupancyData: occupancyData
            });

            occupancyDataArray.push(...occupancyData);

            // I also want to this occupancyData in html table format 



        }

        console.log("Coach Composition Data Array:", coachCompositionDataArray);

        // log coach composition data array to console
        // console.log("Coach Composition Data Array:", coachCompositionDataArray);
        // const coachCompositionData = await coachCompositionByTrainNumber(trainNumber, boardingStationCode, jDate, "B3", "3A");

        // bdd is an outer array where each element is an object and each object has bsd as a key and bsd is an array of objects
        // const bdd = coachCompositionData.bdd;

        // // log coach composition data to console
        // console.log("Coach Composition Data:", coachCompositionData);
        // // the following is one of the object of bdd array, I want to store berthCode, berthNo and bsd array into an array of objects with berthCode, berthNo and bsd as keys
        // // {
        // //     "cabinCoupe": null,
        // //         "cabinCoupeNameNo": "1",
        // //             "berthCode": "L",
        // //                 "berthNo": 1,
        // //                     "from": "NDLS",
        // //                         "to": "RGD",
        // //                             "bsd": [
        // //                                 {
        // //                                     "splitNo": 1,
        // //                                     "from": "NDLS",
        // //                                     "to": "LKO",
        // //                                     "quota": "SS",
        // //                                     "occupancy": true
        // //                                 },
        // //                                 {
        // //                                     "splitNo": 2,
        // //                                     "from": "LKO",
        // //                                     "to": "BSB",
        // //                                     "quota": "GN",
        // //                                     "occupancy": false
        // //                                 },
        // //                                 {
        // //                                     "splitNo": 3,
        // //                                     "from": "BSB",
        // //                                     "to": "PNBE",
        // //                                     "quota": "SS",
        // //                                     "occupancy": true
        // //                                 },
        // //                                 {
        // //                                     "splitNo": 4,
        // //                                     "from": "PNBE",
        // //                                     "to": "RGD",
        // //                                     "quota": "GN",
        // //                                     "occupancy": false
        // //                                 }
        // //                             ],
        // //                                 "quotaCntStn": null,
        // //                                     "enable": true
        // // },
        // const bsdDataFrombdd = bdd.map(coach => {
        //     return {
        //         berthCode: coach.berthCode,
        //         berthNo: coach.berthNo,
        //         bsd: coach.bsd
        //     };
        // });

        // // log bsd data from bdd to console
        // console.log("BSD Data from BDD:", bsdDataFrombdd);

        // // let us find index value for fromStationCode and toStationCode from stationCodeNamePairs array
        // const fromStationIndex = stationCodeNamePairs.findIndex(station => station.code === fromStationCode);
        // const toStationIndex = stationCodeNamePairs.findIndex(station => station.code === toStationCode);

        // if (fromStationIndex === -1) {
        //     throw new Error(`From station code ${fromStationCode} not found in station code name pairs`);
        // }

        // if (toStationIndex === -1) {
        //     throw new Error(`To station code ${toStationCode} not found in station code name pairs`);
        // }
        // // log from station index and to station index to console
        // console.log("From Station Index:", fromStationIndex);
        // console.log("To Station Index:", toStationIndex);


        // // loop over bsdDataFrombdd and for each bsd array, find the occupancy for fromStationIndex and toStationIndex and store it in an array of objects with berthCode, berthNo, fromOccupancy and toOccupancy as keys
        // const occupancyData = bsdDataFrombdd.flatMap(coach => {
        //     const bsdData = coach.bsd;
        //     // loop over each object of bsdData and find the index for from and to station code and it lies between fromStationIndex and toStationIndex then we will consider occupancy for that bsd object
        //     const results = [];
        //     bsdData.forEach(bsd => {
        //         const fromIndex = stationCodeNamePairs.findIndex(station => station.code === bsd.from);
        //         const toIndex = stationCodeNamePairs.findIndex(station => station.code === bsd.to);
        //         if (fromIndex <= fromStationIndex && toIndex >= toStationIndex) {
        //             if (!bsd.occupancy) {
        //                 // return berthNumber, berthCode, bsd.from, bsd.to, bsd.quota and occupancy as false AND also add coachName and coachClass from coachClassPairs array where coachName is same as coach.coachName and classCode is same as coach.classCode
        //                 results.push({
        //                     berthCode: coach.berthCode,
        //                     berthNo: coach.berthNo,
        //                     from: bsd.from,
        //                     to: bsd.to,
        //                     quota: bsd.quota,
        //                     occupancy: false,
        //                     coachName: "B3",
        //                     coachClass: "3A"
        //                 });
        //             }
        //         }
        //     });
        //     return results;
        // });
        // // log occupancy data to console
        // console.log("Occupancy Data:", occupancyData);

        res.json({
            // trainEnquiryResult,
            // stationCodeNamePairs,
            // boardingStationCode,
            // trainCompositionData,
            // coachClassPairs,
            // bdd,
            // bsdDataFrombdd,
            //coachCompositionDataArray
            "occupancyData": occupancyDataArray,
            stationCodeNamePairs
        });


    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// app.get('/seat', (req, res) => {

//     const trainNumber = req.query.trainNumber;

//     const jDate = req.query.jDate;

//     const fromStationCode =
//         req.query.fromStationCode;

//     const toStationCode =
//         req.query.toStationCode;

//     const url =
//         `/data?trainNumber=${trainNumber}` +
//         `&jDate=${jDate}` +
//         `&fromStationCode=${fromStationCode}` +
//         `&toStationCode=${toStationCode}`;

//     res.send(`
//     <html>

//         <head>

//             <title>Seat Availability</title>

//             <style>

//                 body {
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                 }

//                 table {
//                     border-collapse: collapse;
//                     width: 100%;
//                     margin-top: 20px;
//                 }

//                 th, td {
//                     border: 1px solid black;
//                     padding: 10px;
//                     text-align: center;
//                 }

//                 th {
//                     background-color: #f2f2f2;
//                 }

//                 button {
//                     padding: 10px 20px;
//                     margin-bottom: 20px;
//                     cursor: pointer;
//                 }

//                 @media print {

//                     button {
//                         display: none;
//                     }

//                 }

//             </style>

//         </head>

//         <body>

//             <button onclick="downloadPDF()">
//                 Download PDF
//             </button>

//             <div id="data"></div>

//             <script>

//                 function downloadPDF() {
//                     window.print();
//                 }

//                 fetch('${url}')
//                     .then(response => response.json())
//                     .then(data => {

//                         const occupancyData =
//                             data.occupancyData;

//                         const stationCodeNamePairs =
//                             data.stationCodeNamePairs;

//                         const parsedUrl = new URL(
//                             '${url}',
//                             window.location.origin
//                         );

//                         const trainNumber =
//                             parsedUrl.searchParams.get(
//                                 "trainNumber"
//                             );

//                         const jDate =
//                             parsedUrl.searchParams.get(
//                                 "jDate"
//                             );

//                         const fromStationCode =
//                             parsedUrl.searchParams.get(
//                                 "fromStationCode"
//                             );

//                         const toStationCode =
//                             parsedUrl.searchParams.get(
//                                 "toStationCode"
//                             );

//                         const fromStation =
//                             stationCodeNamePairs.find(
//                                 station =>
//                                     station.code ===
//                                     fromStationCode
//                             );

//                         const toStation =
//                             stationCodeNamePairs.find(
//                                 station =>
//                                     station.code ===
//                                     toStationCode
//                             );

//                         const heading =
//                             document.createElement("h2");

//                         heading.textContent =
//                             'Seat Availability for Train ' +
//                             trainNumber +
//                             ' on ' +
//                             jDate +
//                             ' from ' +
//                             fromStationCode +
//                             ' (' +
//                             fromStation.name +
//                             ')' +
//                             ' to ' +
//                             toStationCode +
//                             ' (' +
//                             toStation.name +
//                             ')';

//                         document.body.insertBefore(
//                             heading,
//                             document.getElementById("data")
//                         );

//                         const rows =
//                             occupancyData.map(item => (

//                                 '<tr>' +

//                                     '<td>' +
//                                         item.coachName +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.berthNo +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.berthCode +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.from +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.to +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.quota +
//                                     '</td>' +

//                                 '</tr>'

//                             )).join("");

//                         document.getElementById(
//                             "data"
//                         ).innerHTML =

//                             '<table>' +

//                                 '<thead>' +

//                                     '<tr>' +
//                                         '<th>Coach</th>' +
//                                         '<th>Berth No</th>' +
//                                         '<th>Berth Type</th>' +
//                                         '<th>From</th>' +
//                                         '<th>To</th>' +
//                                         '<th>Quota</th>' +
//                                     '</tr>' +

//                                 '</thead>' +

//                                 '<tbody>' +

//                                     rows +

//                                 '</tbody>' +

//                             '</table>';

//                     });

//             </script>

//         </body>

//     </html>
//     `);

// });

app.get('/seat', (req, res) => {

    const trainNumber =
        req.query.trainNumber;

    const jDate =
        req.query.jDate;

    const fromStationCode =
        req.query.fromStationCode;

    const toStationCode =
        req.query.toStationCode;

    const url =
        `/data?trainNumber=${trainNumber}` +
        `&jDate=${jDate}` +
        `&fromStationCode=${fromStationCode}` +
        `&toStationCode=${toStationCode}`;

    res.send(`

    <html>

        <head>

            <title>Seat Availability</title>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid black;
                    padding: 10px;
                    text-align: center;
                }

                th {
                    background-color: #f2f2f2;
                }

                button {
                    padding: 10px 20px;
                    margin-bottom: 20px;
                    cursor: pointer;
                }

            </style>

        </head>

        <body>

            <button onclick="downloadPDF()">
                Download PDF
            </button>

            <div id="pdf-content">

                <div id="data"></div>

            </div>

            <script>

                const parsedUrl = new URL(
                    '${url}',
                    window.location.origin
                );

                const trainNumber =
                    parsedUrl.searchParams.get(
                        "trainNumber"
                    );

                const jDate =
                    parsedUrl.searchParams.get(
                        "jDate"
                    );

                const fromStationCode =
                    parsedUrl.searchParams.get(
                        "fromStationCode"
                    );

                const toStationCode =
                    parsedUrl.searchParams.get(
                        "toStationCode"
                    );

                function downloadPDF() {

                    const filename =

                        trainNumber + '_' +

                        jDate + '_' +

                        fromStationCode + '_' +

                        toStationCode + '.pdf';

                    const element =
                        document.getElementById(
                            "pdf-content"
                        );

                    html2pdf()
                        .set({

                            margin: 10,

                            filename: filename,

                            html2canvas: {
                                scale: 2
                            },

                            jsPDF: {
                                unit: 'mm',
                                format: 'a4',
                                orientation: 'portrait'
                            }

                        })
                        .from(element)
                        .save();
                }

                fetch('${url}')

                    .then(response => response.json())

                    .then(data => {

                        const occupancyData =
                            data.occupancyData;

                        const stationCodeNamePairs =
                            data.stationCodeNamePairs;

                        const fromStation =
                            stationCodeNamePairs.find(
                                station =>
                                    station.code ===
                                    fromStationCode
                            );

                        const toStation =
                            stationCodeNamePairs.find(
                                station =>
                                    station.code ===
                                    toStationCode
                            );

                        const heading =
                            document.createElement("h2");

                        heading.textContent =

                            'Seat Availability for Train ' +

                            trainNumber +

                            ' on ' +

                            jDate +

                            ' from ' +

                            fromStationCode +

                            ' (' +

                            fromStation.name +

                            ')' +

                            ' to ' +

                            toStationCode +

                            ' (' +

                            toStation.name +

                            ')';

                        document.getElementById(
                            "pdf-content"
                        ).insertBefore(
                            heading,
                            document.getElementById("data")
                        );

                        const rows =
                            occupancyData.map(item => (

                                '<tr>' +

                                    '<td>' +
                                        item.coachName +
                                    '</td>' +

                                    '<td>' +
                                        item.berthNo +
                                    '</td>' +

                                    '<td>' +
                                        item.berthCode +
                                    '</td>' +

                                    '<td>' +
                                        item.from +
                                    '</td>' +

                                    '<td>' +
                                        item.to +
                                    '</td>' +

                                    '<td>' +
                                        item.quota +
                                    '</td>' +

                                '</tr>'

                            )).join("");

                        document.getElementById(
                            "data"
                        ).innerHTML =

                            '<table>' +

                                '<thead>' +

                                    '<tr>' +

                                        '<th>Coach</th>' +

                                        '<th>Berth No</th>' +

                                        '<th>Berth Type</th>' +

                                        '<th>From</th>' +

                                        '<th>To</th>' +

                                        '<th>Quota</th>' +

                                    '</tr>' +

                                '</thead>' +

                                '<tbody>' +

                                    rows +

                                '</tbody>' +

                            '</table>';

                    })

                    .catch(error => {

                        console.error(error);

                        document.getElementById(
                            "data"
                        ).innerHTML =

                            '<h3>Error loading data</h3>';

                    });

            </script>

        </body>

    </html>

    `);

});

// app.get('/seat', (req, res) => {

//     res.send(`

//     <html>

//         <head>

//             <title>IRCTC Seat Availability</title>

//             <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

//             <style>

//                 body {
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                 }

//                 h1 {
//                     margin-bottom: 20px;
//                 }

//                 .form-container {
//                     margin-bottom: 20px;
//                 }

//                 input {
//                     padding: 8px;
//                     margin-right: 10px;
//                     margin-bottom: 10px;
//                 }

//                 button {
//                     padding: 10px 20px;
//                     cursor: pointer;
//                     margin-right: 10px;
//                 }

//                 table {
//                     border-collapse: collapse;
//                     width: 100%;
//                     margin-top: 20px;
//                 }

//                 th, td {
//                     border: 1px solid black;
//                     padding: 10px;
//                     text-align: center;
//                 }

//                 th {
//                     background-color: #f2f2f2;
//                 }

//             </style>

//         </head>

//         <body>

//             <h1>IRCTC Seat Availability</h1>

//             <div class="form-container">

//                 <input
//                     id="trainNumber"
//                     placeholder="Train Number"
//                 >

//                 <input
//                     id="jDate"
//                     type="date"
//                 >

//                 <input
//                     id="fromStationCode"
//                     placeholder="From Station Code"
//                 >

//                 <input
//                     id="toStationCode"
//                     placeholder="To Station Code"
//                 >

//                 <button onclick="loadData()">
//                     Search
//                 </button>

//                 <button onclick="downloadPDF()">
//                     Download PDF
//                 </button>

//             </div>

//             <div id="pdf-content">

//                 <div id="heading"></div>

//                 <div id="data"></div>

//             </div>

//             <script>

//                 async function loadData() {

//                     const trainNumber =
//                         document.getElementById(
//                             "trainNumber"
//                         ).value;

//                     const jDate =
//                         document.getElementById(
//                             "jDate"
//                         ).value;

//                     const fromStationCode =
//                         document.getElementById(
//                             "fromStationCode"
//                         ).value;

//                     const toStationCode =
//                         document.getElementById(
//                             "toStationCode"
//                         ).value;

//                     if (
//                         !trainNumber ||
//                         !jDate ||
//                         !fromStationCode ||
//                         !toStationCode
//                     ) {

//                         alert(
//                             "Please fill all fields"
//                         );

//                         return;
//                     }

//                     const url =

//                         '/data?' +

//                         'trainNumber=' +
//                         trainNumber +

//                         '&jDate=' +
//                         jDate +

//                         '&fromStationCode=' +
//                         fromStationCode +

//                         '&toStationCode=' +
//                         toStationCode;

//                     try {

//                         const response =
//                             await fetch(url);

//                         const data =
//                             await response.json();

//                         if (data.error) {

//                             document.getElementById(
//                                 "data"
//                             ).innerHTML =

//                                 '<h3>' +
//                                 data.error +
//                                 '</h3>';

//                             return;
//                         }

//                         const occupancyData =
//                             data.occupancyData;

//                         const stationCodeNamePairs =
//                             data.stationCodeNamePairs;

//                         const fromStation =
//                             stationCodeNamePairs.find(
//                                 station =>
//                                     station.code ===
//                                     fromStationCode
//                             );

//                         const toStation =
//                             stationCodeNamePairs.find(
//                                 station =>
//                                     station.code ===
//                                     toStationCode
//                             );

//                         document.getElementById(
//                             "heading"
//                         ).innerHTML =

//                             '<h2>' +

//                             'Seat Availability for Train ' +

//                             trainNumber +

//                             ' on ' +

//                             jDate +

//                             ' from ' +

//                             fromStationCode +

//                             ' (' +

//                             fromStation.name +

//                             ')' +

//                             ' to ' +

//                             toStationCode +

//                             ' (' +

//                             toStation.name +

//                             ')' +

//                             '</h2>';

//                         const rows =
//                             occupancyData.map(item => (

//                                 '<tr>' +

//                                     '<td>' +
//                                         item.coachName +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.berthNo +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.berthCode +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.from +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.to +
//                                     '</td>' +

//                                     '<td>' +
//                                         item.quota +
//                                     '</td>' +

//                                 '</tr>'

//                             )).join("");

//                         document.getElementById(
//                             "data"
//                         ).innerHTML =

//                             '<table>' +

//                                 '<thead>' +

//                                     '<tr>' +

//                                         '<th>Coach</th>' +

//                                         '<th>Berth No</th>' +

//                                         '<th>Berth Type</th>' +

//                                         '<th>From</th>' +

//                                         '<th>To</th>' +

//                                         '<th>Quota</th>' +

//                                     '</tr>' +

//                                 '</thead>' +

//                                 '<tbody>' +

//                                     rows +

//                                 '</tbody>' +

//                             '</table>';

//                     } catch (error) {

//                         console.error(error);

//                         document.getElementById(
//                             "data"
//                         ).innerHTML =

//                             '<h3>Error fetching data</h3>';
//                     }
//                 }

//                 function downloadPDF() {

//                     const trainNumber =
//                         document.getElementById(
//                             "trainNumber"
//                         ).value;

//                     const jDate =
//                         document.getElementById(
//                             "jDate"
//                         ).value;

//                     const fromStationCode =
//                         document.getElementById(
//                             "fromStationCode"
//                         ).value;

//                     const toStationCode =
//                         document.getElementById(
//                             "toStationCode"
//                         ).value;

//                     const filename =

//                         trainNumber + '_' +

//                         jDate + '_' +

//                         fromStationCode + '_' +

//                         toStationCode + '.pdf';

//                     const element =
//                         document.getElementById(
//                             "pdf-content"
//                         );

//                     html2pdf()
//                         .set({

//                             margin: 5,

//                             filename: filename,

//                             html2canvas: {
//                                 scale: 2
//                             },

//                             jsPDF: {
//                                 unit: 'mm',
//                                 format: 'a4',
//                                 orientation: 'portrait'
//                             }

//                         })
//                         .from(element)
//                         .save();
//                 }

//             </script>

//         </body>

//     </html>

//     `);

// });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});