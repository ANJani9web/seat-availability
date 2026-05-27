function getOccupancyData(coachCompositionData, stationCodeNamePairs, fromStationCode, toStationCode, coachName, coachCode) {
    const bdd = coachCompositionData.bdd;

    // log coach composition data to console
    console.log("Coach Composition Data:", coachCompositionData);
    // the following is one of the object of bdd array, I want to store berthCode, berthNo and bsd array into an array of objects with berthCode, berthNo and bsd as keys
    // {
    //     "cabinCoupe": null,
    //         "cabinCoupeNameNo": "1",
    //             "berthCode": "L",
    //                 "berthNo": 1,
    //                     "from": "NDLS",
    //                         "to": "RGD",
    //                             "bsd": [
    //                                 {
    //                                     "splitNo": 1,
    //                                     "from": "NDLS",
    //                                     "to": "LKO",
    //                                     "quota": "SS",
    //                                     "occupancy": true
    //                                 },
    //                                 {
    //                                     "splitNo": 2,
    //                                     "from": "LKO",
    //                                     "to": "BSB",
    //                                     "quota": "GN",
    //                                     "occupancy": false
    //                                 },
    //                                 {
    //                                     "splitNo": 3,
    //                                     "from": "BSB",
    //                                     "to": "PNBE",
    //                                     "quota": "SS",
    //                                     "occupancy": true
    //                                 },
    //                                 {
    //                                     "splitNo": 4,
    //                                     "from": "PNBE",
    //                                     "to": "RGD",
    //                                     "quota": "GN",
    //                                     "occupancy": false
    //                                 }
    //                             ],
    //                                 "quotaCntStn": null,
    //                                     "enable": true
    // },
    const bsdDataFrombdd = bdd.map(coach => {
        return {
            berthCode: coach.berthCode,
            berthNo: coach.berthNo,
            bsd: coach.bsd
        };
    });

    // log bsd data from bdd to console
    console.log("BSD Data from BDD:", bsdDataFrombdd);

    // let us find index value for fromStationCode and toStationCode from stationCodeNamePairs array
    const fromStationIndex = stationCodeNamePairs.findIndex(station => station.code === fromStationCode);
    const toStationIndex = stationCodeNamePairs.findIndex(station => station.code === toStationCode);

    if (fromStationIndex === -1) {
        throw new Error(`From station code ${fromStationCode} not found in station code name pairs`);
    }

    if (toStationIndex === -1) {
        throw new Error(`To station code ${toStationCode} not found in station code name pairs`);
    }
    // log from station index and to station index to console
    console.log("From Station Index:", fromStationIndex);
    console.log("To Station Index:", toStationIndex);
    
    // birth code list 
    // L -> 'Lower', M -> 'Middle', U -> 'Upper', 'P' -> 'Side Upper', 'R' -> 'Side Lower'

    // loop over bsdDataFrombdd and for each bsd array, find the occupancy for fromStationIndex and toStationIndex and store it in an array of objects with berthCode, berthNo, fromOccupancy and toOccupancy as keys
    const occupancyData = bsdDataFrombdd.flatMap(coach => {
        const bsdData = coach.bsd;
        // loop over each object of bsdData and find the index for from and to station code and it lies between fromStationIndex and toStationIndex then we will consider occupancy for that bsd object
        const results = [];
        bsdData.forEach(bsd => {
            const fromIndex = stationCodeNamePairs.findIndex(station => station.code === bsd.from);
            const toIndex = stationCodeNamePairs.findIndex(station => station.code === bsd.to);
            if (fromIndex <= fromStationIndex && toIndex >= toStationIndex) {
                if (!bsd.occupancy) {
                    // return berthNumber, berthCode, bsd.from, bsd.to, bsd.quota and occupancy as false AND also add coachName and coachClass from coachClassPairs array where coachName is same as coach.coachName and classCode is same as coach.classCode
                    results.push({
                        berthCode: findBerthCompleteNameFromBerthCode(coach.berthCode),
                        berthNo: coach.berthNo,
                        from: findFromStationNameFromCode(bsd.from, stationCodeNamePairs),
                        to: findToStationNameFromCode(bsd.to, stationCodeNamePairs),
                        quota: bsd.quota,
                        occupancy: false,
                        coachName,
                        coachCode
                    });
                }
            }
        });
        return results;
    });
    // log occupancy data to console
    console.log("Occupancy Data:", occupancyData);

    return occupancyData;
}

function findBerthCompleteNameFromBerthCode(berthCode) {
    switch (berthCode) {
        case 'L':
            return 'Lower';
        case 'M':
            return 'Middle';
        case 'U':
            return 'Upper';
        case 'P':
            return 'Side Upper';
        case 'R':
            return 'Side Lower';
        case 'W':
            return 'Window Seat';
        case 'S':
            return 'Side but not Window Seat';
        default:
            return berthCode;
    }
}

function findFromStationNameFromCode(stationCode, stationCodeNamePairs) {
    const station = stationCodeNamePairs.find(station => station.code === stationCode);
    return (station ? station.name : stationCode) + '(' + stationCode + ')';
}

function findToStationNameFromCode(stationCode, stationCodeNamePairs) {
    const station = stationCodeNamePairs.find(station => station.code === stationCode);
    return (station ? station.name : stationCode) + '(' + stationCode + ')';
}

module.exports = {
    getOccupancyData
}