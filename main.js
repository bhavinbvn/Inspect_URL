import validator from 'validator';
import fs from 'fs';
import chalk from 'chalk';
import { URL } from 'url';

let url = process.argv[2];

if (validator.isURL(url)) {
    console.log(chalk.green.bold('The URL is valid.'));

    let searchParams = new URL(url).searchParams;

    if (searchParams.toString()) {

        fs.appendFile('search_params.txt', `${searchParams.toString()}\n`, (err) => {
            if (err) throw err;
            console.log(chalk.green('Search parameters saved to search_params.txt'));
        });
    } else {
        console.log(chalk.yellow('No search parameters found in the URL.'));
    }

    fs.appendFile('url_list.txt', `${url}\n`, (err) => {
        if (err) throw err;
    });


    fs.readFile('block_url.txt', 'utf8', (err, data) => {
        if (err) throw err;

        let block_urls = data.split('\n');

        if (block_urls.includes(url)) {
            console.log(chalk.blue.bold('The URL is blocked.'));

    
            fs.readFile('myjsonfile.json', 'utf8', (readErr, fileData) => {
                if (readErr) console.log(readErr);
                else {
                    let obj = {};

                    try {
                        obj = JSON.parse(fileData);
                    } catch (parseError) {
                        console.log(chalk.red('JSON parse error. Initializing a new object.'));
                        obj = {};
                    }

                    if (obj[url]) {
                        obj[url].count += 1;
                    } else {
                        obj[url] = { count: 1 };
                    }

                    let json = JSON.stringify(obj, null, 2);
                    fs.writeFile('myjsonfile.json', json, 'utf8', (writeErr) => {
                        if (writeErr) console.log(writeErr);
                        else console.log(chalk.green.bold('JSON file updated successfully.'));
                    });
                }
            });
        }
    });
} else {
    console.log(chalk.red.bold('The URL is invalid.'));
}
