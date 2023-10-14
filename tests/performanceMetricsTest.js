import puppeteer from 'puppeteer';
import chai, { expect, should } from 'chai';
import lighthouse from 'lighthouse';
import { URL } from 'url';

describe('Performance Metrics Tests', function() {

    // Increase the default Mocha test timeout for Lighthouse
    this.timeout(100000);

    let browser;
    const testURL = 'https://www.bbc.co.uk/bitesize/subjects/zv48q6f'; 

    before(async () => {
        browser = await puppeteer.launch();
    });

    after(async () => {
        await browser.close();
    });

    it('Should have a good first contentful paint metric', async() => {

        const port = (new URL(browser.wsEndpoint())).port;
        const result = await lighthouse(testURL, {
            port: port,
            onlyCategories: ['performance']
        });
    
        const fcpValue = result.lhr.audits['first-contentful-paint'].numericValue;
    
        // Displaying the FCP value and the expected threshold
        console.log(`Measured First Contentful Paint (FCP): ${fcpValue} milliseconds`);
        console.log("Expected FCP for a good user experience: 1800 milliseconds or less.");
    
        // Check if the First Contentful Paint metric meets your threshold
        if (fcpValue <= 1800) {
            console.log("Test Passed: The FCP is within the acceptable range.");
        } else {
            console.log("Test Failed: The FCP is higher than the recommended value for a good user experience.");
        }
    
        expect(fcpValue).to.be.lessThan(1800); // Expecting it to be less than 1.8 seconds
    
    });
    
    it('Should have a good Largest Contentful Paint (LCP) metric', async() => {

        const port = (new URL(browser.wsEndpoint())).port;
        const result = await lighthouse(testURL, {
            port: port,
            onlyCategories: ['performance']
        });
    
        const lcpValue = result.lhr.audits['largest-contentful-paint'].numericValue;
    
        // Displaying the LCP value and the expected threshold
        console.log(`Measured Largest Contentful Paint (LCP): ${lcpValue} milliseconds`);
        console.log("Expected LCP for a good user experience: 2500 milliseconds or less.");
    
        // Check if the LCP metric meets your threshold
        if (lcpValue <= 2500) {
            console.log("Test Passed: The LCP is within the acceptable range.");
        } else {
            console.log("Test Failed: The LCP is higher than the recommended value for a good user experience.");
            console.error('Detailed Issues with LCP:', result.lhr.audits['largest-contentful-paint'].details);
        }
    
        expect(lcpValue).to.be.lessThan(2500); // Expecting it to be less than 2.5 seconds
    
    }); 

});