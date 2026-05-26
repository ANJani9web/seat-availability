async function coachCompositionByTrainNumber(trainNumber, boardingStationCode, jDate, coach, cls) {
     // let us call this api but before this call, also print the function parameters
//     curl--location 'https://www.irctc.co.in/online-charts/api/coachComposition' \
//     --header 'accept: application/json' \
//     --header 'accept-language: en-US,en;q=0.9' \
//     --header 'content-type: application/json' \
//     --header 'origin: https://www.irctc.co.in' \
//     --header 'Cookie: TS018d84e5=01d83d9ce7318b11fb7c6c08e8b67a9a151016e273e700a4d0de17c5ef0e2e537c7dae1ab9d9ca038407ecb35841dbefe449d37fb4; _abck=B71E872ACB2D409C6DB6595DCFC00431~-1~YAAQTAHARbbEUUCeAQAA12eDYg/ptDxWDY5SOfiRXbsYYcfjpuYnbvHyKVsw6nzOvfE2sW1EgQHNu4yo33QBwYk15ujT1N9GgteW5DEBGqygW3d4SKFHyMVLFs9E/7a8vH0LOyH29i/pfOcZmy6umXlAmxq05UYTCNyQv70WFzRc8pGNR5RmeQKElsinfSDq5cplpEKg5eFXEED+VZvd9KyiHBYV9ctgXCukCJdo0Qsa/IestR7iRlpxeOIxoEY9xOIxpn9Jp4+eBiZc2oguNxYBowal5p5ObIQQN7OCvowtIuEVs2/mzHoMmrbgaHc2vHWTq7JGESF+8iw0VqrP3+vwXAIqRIyi55QAzrhNRgsIHaeiWut0unFaAbewkeIui/8I0INalNLDnu0T/nb7KrV0IIx7rkgYJUILUinSo8w52zXmcNCWf9HGJryl73XKFAkTfrrAcqEiruDocA4JrDZOkIkprBl1jwc=~-1~-1~-1~-1~-1; bm_sz=7F23DE77731543FEE35DBCDF695EB2C3~YAAQTAHARbfEUUCeAQAA2GeDYh+kIE9aJWU9h1wB7YYug7ABod2oHZfSrGcS6ASvZ/rJiPS2ut7y2OrWTUjzR5SNR4yWUe6H68h9OhuI6J1w0KDPgoLjqrwnCBEBEAZ/u5j3+VnPm8tSsOhChM8XWkxLuAYA7CYKBLhdv39xaDyGEGO7F2g6/Ps7H6kandCDtP1m8qhjP8KlnbD+ZlGB4LNYTNFJMXtQhjOqLnWxVx1Uhput8brQGjcUuWy0gHlCesEav5w9tAu1B79h50pRDIxs8T8rekixE2wflMDtdpYDZDDZKHUzEtQ61yMLsz/bMbmcTddO0DvwAjdk6gfXkgiXB7c06oQgD9/pycKhX3fG1DI=~3360050~4539448' \
//     --data '{
//     "trainNo": "12392",
//         "boardingStation": "NDLS",
//             "remoteStation": "NDLS",
//                 "trainSourceStation": "NDLS",
//                     "jDate": "2026-05-25",
//                         "coach": "B1",
//                             "cls": "3A"
// } '
    console.log(`Fetching coach composition data for train number ${trainNumber} on date ${jDate} from boarding station ${boardingStationCode} for coach ${coach} and class ${cls}...`);
    const coachCompositionResponse = await fetch(`https://www.irctc.co.in/online-charts/api/coachComposition`, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "origin": "https://www.irctc.co.in",
            //"Cookie": "TS018d84e5=01d83d9ce7318b11fb7c6c08e8b67a9a151016e273e700a4d0de17c5ef0e2e537c7dae1ab9d9ca038407ecb35841dbefe449d37fb4; _abck=B71E872ACB2D409C6DB6595DCFC00431~-1~YAAQTAHARbbEUUCeAQAA12eDYg/ptDxWDY5SOfiRXbsYYcfjpuYnbvHyKVsw6nzOvfE2sW1EgQHNu4yo33QBwYk15ujT1N9GgteW5DEBGqygW3d4SKFHyMVLFs9E/7a8vH0LOyH29i/pfOcZmy6umXlAmxq05UYTCNyQv70WFzRc8pGNR5RmeQKElsinfSDq5cplpEKg5eFXEED+VZvd9KyiHBYV9ctgXCukCJdo0Qsa/IestR7iRlpxeOIxoEY9xOIxpn9Jp4+eBiZc2oguNxYBowal5p5ObIQQN7OCvowtIuEVs2/mzHoMmrbgaHc2vHWTq7JGESF+8iw0VqrP3+vwXAIqRIyi55QAzrhNRgsIHaeiWut0unFaAbewkeIui/8I0INalNLDnu0T/nb7KrV0IIx7rkgYJUILUinSo8w52zXmcNCWf9HGJryl73XKFAkTfrrAcqEiruDocA4JrDZOkIkprBl1jwc="
        },
        body: JSON.stringify({
            trainNo: trainNumber,
            boardingStation: boardingStationCode,
            remoteStation: boardingStationCode,
            trainSourceStation: boardingStationCode,
            jDate: jDate,
            coach: coach,
            cls: cls
        })
    });

    console.log(`Received response for coach composition of train number ${trainNumber} with status ${coachCompositionResponse.status}`);

    if (!coachCompositionResponse.ok) {
        throw new Error(`Failed to fetch coach composition data for train number ${trainNumber}: ${coachCompositionResponse.statusText}`);
    }

    const coachCompositionData = await coachCompositionResponse.json();

    // print coach composition data to console
    console.log("Coach Composition Data:", coachCompositionData);

    return coachCompositionData;
}

module.exports = {
    coachCompositionByTrainNumber
}