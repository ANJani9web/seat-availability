async function fetchTrainCompositionByTrainNumber(trainNumber, jDate, boardingStationCode) {
    // let us fetch data using this curl 
//     curl--location 'https://www.irctc.co.in/online-charts/api/trainComposition' \
//     --header 'accept: application/json' \
//     --header 'accept-language: en-US,en;q=0.9' \
//     --header 'content-type: application/json' \
//     --header 'origin: https://www.irctc.co.in' \
//     --header 'Cookie: TS018d84e5=01d83d9ce7d9e889b8659ba3406a6bab7d9ca3ef4bae4d42d8a592acf888811ea27c3221a88cc536a92664817ddc06f9e524e3a11d; _abck=B71E872ACB2D409C6DB6595DCFC00431~-1~YAAQZwHARV3VHFWeAQAAYECGXw/gD+OTAtwP8SdiL3ADn+WIGgV453Uz2ccaz2f1uOYclWmRprwHH1EJWrMTAS2N/jckTf0kKXKVpnm5YiDdyxTKowjJV52JsKn4wTOtNs7rngzQD/w6XRPaywtB2qCydQmf0Eoc/DkTqmaZ181DOyNBZGgB7HB/yVhiUCTdO5QzmP8U+ZyB/0xQbdpgmB7dT90Opr1HMpwUzO4qCYLr0hVY4HNaMjNc7lnsJEi9tEbcOEg+3TnN+SoMLZzYboz1LzEmqtLQup3IafuVn2KrQbdexlUnNYkIXuG8qbGcGAbGOJRlE877u5ds/OkZ1L/EwPBT409K0owDYm/+YYFziopMlaaSXFpHQvfRUnsFT+or5UCvLQS6aUj0fwiA/YQVWm5OJ0roifOjYjKEUZQYQqK7BdOoWTg28j5rXlwLTXSsP+1Lokau5+zZDIk2pHm5wIfDhEkXZOE=~-1~-1~-1~-1~-1; bm_sz=FF10471AA5201DE85FCF4D1DA8BEFD25~YAAQZwHARV7VHFWeAQAAYECGXx/Nfe68IfCVrckk/q8F1yYWnbpL6FxA8Pg8eXlrl3AFFXAPDc38odEImqjC/QlIYLKRN8loxOO19zU1V8IxXeFxbhQQR8WS5LH6lO72MDApZ2VuNTaXhkVB5ZB0dRl400iH3VM9TMWu+XdyhDl8yBFUa4ebfc/9LSJcN54VMPpuY3Vdlxag8W6dBTOpYExazv8KZxsEM+N0ow2G3QGOtivZ5sTCHeI7R8ibEHg2VwazXBMNkcTf1monVpFDs6H74gsPPqh6wVfil2grudY34c3+juDuBjc0qTc7bPFJHg6qXdLh0F6MjalEpb+4gpB/WEMwm8xgibnm1nGv32g49qY=~4602177~4470850' \
//     --data '{
//     "trainNo": "12392",
//         "jDate": "2026-05-25",
//             "boardingStation": "NDLS"
// } '

    console.log(`Fetching train composition data for train number ${trainNumber} on date ${jDate} from boarding station ${boardingStationCode}...`);
    const trainCompositionResponse = await fetch(`https://www.irctc.co.in/online-charts/api/trainComposition`, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "origin": "https://www.irctc.co.in",
            //"Cookie": "TS018d84e5=01d83d9ce7d9e889b8659ba3406a6bab7d9ca3ef4bae4d42d8a592acf888811ea27c3221a88cc536a92664817ddc06f9e524e3a11d; _abck=B71E872ACB2D409C6DB6595DCFC00431~-1~YAAQZwHARV3VHFWeAQAAYECGXw/gD+OTAtwP8SdiL3ADn+WIGgV453Uz2ccaz2f1uOYclWmRprwHH1EJWrMTAS2N/jckTf0kKXKVpnm5YiDdyxTKowjJV52JsKn4wTOtNs7rngzQD/w6XRPaywtB2qCydQmf0Eoc/DkTqmaZ181DOyNBZGgB7HB/yVhiUCTdO5QzmP8U+ZyB/0xQbdpgmB7dT90Opr1HMpwUzO4qCYLr0hVY4HNaMjNc7lnsJEi9tEbcOEg+3TnN+SoMLZzYboz1LzEmqtLQup3IafuVn2KrQbdexlUnNYkIXuG8qbGcGAbGOJRlE877u5ds/OkZ1L/EwPBT409K0owDYm/+YYFziopMlaaSXFpHQvfRUnsFT+or5UCvLQS6aUj0fwiA/YQVWm5OJ0roifOjYjKEUZQYQqK7BdOoWTg28j5rXlwLTXSsP+1Lokau5+zZDIk2pHm5wIfDhEkXZOE=~-1~-1~-1~-1~-1; bm_sz=FF10471AA5201DE85FCF4D1DA8BEFD25~YAAQZwHARV7VHFWeAQAAYECGXx/Nfe68IfCVrckk/q8F1yYWnbpL6FxA8Pg8eXlrl3AFFXAPDc38odEImqjC/QlIYLKRN8loxOO19zU1V8IxXeFxbhQQR8WS5LH6lO72MDApZ2VuNTaXhkVB5ZB0dRl400iH3VM9TMWu+XdyhDl8yBFUa4ebfc/9LSJcN54VMPpuY3Vdlxag8W6dBTOpYExazv8KZxsEM+N0ow2G3QGOtivZ5sTCHeI7R8ibEHg2VwazXBMNkcTf1monVpFDs6H74gsPPqh6wVfil2grudY34c3+juDuBjc0qTc7bPFJHg6qXdLh0F6MjalEpb+4gpB/WEMwm8xgibnm1nGv32g49qY=~4602177~4470850"
        },
        body: JSON.stringify({
            trainNo: trainNumber,
            jDate: jDate,
            boardingStation: boardingStationCode
        })
    });

    console.log(`Received response for train composition of train number ${trainNumber} with status ${trainCompositionResponse.status}`);

    if (!trainCompositionResponse.ok) {
        throw new Error(`Failed to fetch train composition data for train number ${trainNumber}: ${trainCompositionResponse.statusText}`);
    }

    const trainCompositionData = await trainCompositionResponse.json();

    // print train composition data to console
    console.log("Train Composition Data:", trainCompositionData);

    return trainCompositionData;

}

module.exports = {
    fetchTrainCompositionByTrainNumber
}
