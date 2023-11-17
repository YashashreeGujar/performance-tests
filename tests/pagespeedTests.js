import axios from 'axios';
import chai, { expect } from 'chai';
import testURLs from './testData.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Performance Metrics Tests with PageSpeed Insights', function() {

    this.timeout(100000); // Increase the default timeout for API call

    const apiKey = process.env.PAGE_SPEED_API_KEY;


    testURLs.forEach(testURL => {
        describe(`Testing URL: ${testURL}`, function() {
            let performanceData;

            before(async () => {
                const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${testURL}&key=${apiKey}`);
                performanceData = response.data.lighthouseResult.audits;
            });

            it('Should have a good First Contentful Paint (FCP) metric', async() => {
                const fcpValue = performanceData['first-contentful-paint'].numericValue;
                
                
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
                const lcpValue = performanceData['largest-contentful-paint'].numericValue;
                
                
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
        
           /* it('Should have a good Total Blocking Time (TBT) metric as a proxy for FID', async() => {
                const tbtValue = performanceData['total-blocking-time'].numericValue;
                
                // Rest of your TBT logic goes here (similar to original)
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
            });*/
            
        
            it('Should have a good Cumulative Layout Shift (CLS) metric', async() => {
                const clsValue = performanceData['cumulative-layout-shift'].numericValue;
                
                
        
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
        
        });
    });
});
