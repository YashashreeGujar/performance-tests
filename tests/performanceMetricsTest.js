import puppeteer from 'puppeteer';
import chai, { expect, should } from 'chai';
import lighthouse from 'lighthouse';
import { URL } from 'url';

describe('Performance Metrics Tests', function() {

    // Increase the default Mocha test timeout for Lighthouse
    this.timeout(100000);

    let browser;
    const testURL = 'https://www.bbc.co.uk/bitesize/levels/zbr9wmn/year/zncsscw'; 

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

   it('Should have a good Total Blocking Time (TBT) metric as a proxy for FID', async() => {

        const port = (new URL(browser.wsEndpoint())).port;
        const result = await lighthouse(testURL, {
            port: port,
            onlyCategories: ['performance']
        });
    
        const tbtValue = result.lhr.audits['total-blocking-time'].numericValue;
    
        // Displaying the TBT value and the expected threshold
        console.log(`Measured Total Blocking Time (TBT): ${tbtValue} milliseconds`);
        console.log("Expected TBT (as a proxy for FID) for a good user experience: 100 milliseconds or less.");
    
        // Check if the TBT metric meets your threshold
        if (tbtValue <= 100) {
            console.log("Test Passed: The TBT is within the acceptable range.");
        } else {
            console.log("Test Failed: The TBT is higher than the recommended value for a good user experience.");
            console.error('Detailed Issues with TBT:', result.lhr.audits['total-blocking-time'].details);
        }
    
        expect(tbtValue).to.be.lessThan(100); // Expecting it to be less than 100ms
    
    });

     it('Should have a good Cumulative Layout Shift (CLS) metric', async() => {

        const port = (new URL(browser.wsEndpoint())).port;
        const result = await lighthouse(testURL, {
            port: port,
            onlyCategories: ['performance']
        });
    
        const clsValue = result.lhr.audits['cumulative-layout-shift'].numericValue;
    
        // Displaying the CLS value and the expected threshold
        console.log(`Measured Cumulative Layout Shift (CLS): ${clsValue}`);
        console.log("Expected CLS for a good user experience: 0.1 or less.");
    
        // Check if the CLS metric meets your threshold
        if (clsValue <= 0.1) {
            console.log("Test Passed: The CLS is within the acceptable range.");
        } else {
            console.log("Test Failed: The CLS is higher than the recommended value for a good user experience.");
            console.error('Detailed Issues with CLS:', result.lhr.audits['cumulative-layout-shift'].details);
        }
    
        expect(clsValue).to.be.lessThanOrEqual(0.1); // Expecting it to be 0.1 or less
    
    });

    it('Performance Score Based on Single Run', async () => {
        const port = new URL(browser.wsEndpoint()).port;
        const result = await lighthouse(testURL, {
          port: port,
          onlyCategories: ['performance'],
        });
    
        const singleRunScore = result.lhr.categories.performance.score * 100;
    
        // Log the performance score based on a single run
        console.log(`Performance Score (Single Run): ${singleRunScore}`);
    
        // You can also add assertions if needed
        expect(singleRunScore).to.be.at.least(0); // Adjust the minimum score as needed
      });

      it('Average Performance Score Based on 5 Runs', async () => {
        const numRuns = 5;
        let totalScore = 0;
    
        for (let i = 0; i < numRuns; i++) {
          const port = new URL(browser.wsEndpoint()).port;
          const result = await lighthouse(testURL, {
            port: port,
            onlyCategories: ['performance'],
          });
    
          const score = result.lhr.categories.performance.score * 100;
          totalScore += score;
        }
    
        const averageScore = totalScore / numRuns;
    
        // Log the average performance score as a number
        console.log(averageScore);
      });
    
    });
    